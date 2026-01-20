import bcrypt from 'bcryptjs';
import { builder } from '../builder.js';
import { UserType, CreateUserInput, UpdateUserInput } from '../types/user.js';

builder.queryField('users', (t) =>
  t.field({
    type: [UserType],
    resolve: async (_parent, _args, ctx) => {
      return ctx.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      });
    },
  })
);

builder.queryField('user', (t) =>
  t.field({
    type: UserType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.user.findUnique({
        where: { id: String(args.id) },
      });
    },
  })
);

builder.mutationField('createUser', (t) =>
  t.field({
    type: UserType,
    args: {
      input: t.arg({ type: CreateUserInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const hashedPassword = await bcrypt.hash(args.input.password, 10);
      return ctx.prisma.user.create({
        data: {
          email: args.input.email,
          name: args.input.name,
          password: hashedPassword,
        },
      });
    },
  })
);

builder.mutationField('updateUser', (t) =>
  t.field({
    type: UserType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateUserInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.user.update({
        where: { id: String(args.id) },
        data: {
          ...(args.input.email && { email: args.input.email }),
          ...(args.input.name !== undefined && { name: args.input.name }),
        },
      });
    },
  })
);

builder.mutationField('deleteUser', (t) =>
  t.field({
    type: UserType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.user.delete({
        where: { id: String(args.id) },
      });
    },
  })
);
