import { builder } from '../builder.js';

export const UserType = builder.objectRef<{
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}>('User');

UserType.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    posts: t.field({
      type: [PostType],
      resolve: async (user, _args, ctx) => {
        return ctx.prisma.post.findMany({
          where: { authorId: user.id },
        });
      },
    }),
  }),
});

import { PostType } from './post.js';

export const CreateUserInput = builder.inputType('CreateUserInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    name: t.string({ required: false }),
    password: t.string({ required: true }),
  }),
});

export const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    email: t.string({ required: false }),
    name: t.string({ required: false }),
  }),
});
