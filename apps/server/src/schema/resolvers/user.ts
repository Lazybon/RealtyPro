import bcrypt from 'bcryptjs';
import { builder } from '../builder.js';
import { UserType, AuthPayloadType, RegisterInput, LoginInput, UpdateUserInput } from '../types/user.js';

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

builder.queryField('me', (t) =>
  t.field({
    type: UserType,
    nullable: true,
    resolve: async (_parent, _args, ctx) => {
      if (!ctx.userId) return null;
      return ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });
    },
  })
);

builder.mutationField('register', (t) =>
  t.field({
    type: AuthPayloadType,
    args: {
      input: t.arg({ type: RegisterInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: args.input.email },
      });
      
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }
      
      const hashedPassword = await bcrypt.hash(args.input.password, 10);
      
      const user = await ctx.prisma.user.create({
        data: {
          email: args.input.email,
          password: hashedPassword,
          firstName: args.input.firstName,
          lastName: args.input.lastName,
        } as any,
      });
      
      return {
        user,
        token: user.id,
      };
    },
  })
);

builder.mutationField('login', (t) =>
  t.field({
    type: AuthPayloadType,
    args: {
      input: t.arg({ type: LoginInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: args.input.email },
      });
      
      if (!user) {
        throw new Error('Неверный email или пароль');
      }
      
      const validPassword = await bcrypt.compare(args.input.password, (user as any).password);
      
      if (!validPassword) {
        throw new Error('Неверный email или пароль');
      }
      
      return {
        user,
        token: user.id,
      };
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
          ...(args.input.firstName !== undefined && { firstName: args.input.firstName }),
          ...(args.input.lastName !== undefined && { lastName: args.input.lastName }),
          ...(args.input.phone !== undefined && { phone: args.input.phone }),
          ...(args.input.profileImageUrl !== undefined && { profileImageUrl: args.input.profileImageUrl }),
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

builder.mutationField('changePassword', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      currentPassword: t.arg.string({ required: true }),
      newPassword: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.userId },
      });
      
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      
      const validPassword = await bcrypt.compare(args.currentPassword, (user as any).password);
      
      if (!validPassword) {
        throw new Error('Неверный текущий пароль');
      }
      
      if (args.newPassword.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }
      
      const hashedPassword = await bcrypt.hash(args.newPassword, 10);
      
      await ctx.prisma.user.update({
        where: { id: ctx.userId },
        data: { password: hashedPassword } as any,
      });
      
      return true;
    },
  })
);
