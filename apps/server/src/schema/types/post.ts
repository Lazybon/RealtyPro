import { builder } from '../builder.js';
import { UserType } from './user.js';

export const PostType = builder.objectRef<{
  id: string;
  title: string;
  content: string | null;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}>('Post');

PostType.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    content: t.exposeString('content', { nullable: true }),
    published: t.exposeBoolean('published'),
    authorId: t.exposeString('authorId'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    author: t.field({
      type: UserType,
      resolve: async (post, _args, ctx) => {
        const author = await ctx.prisma.user.findUnique({
          where: { id: post.authorId },
        });
        if (!author) {
          throw new Error('Author not found');
        }
        return author;
      },
    }),
  }),
});

export const CreatePostInput = builder.inputType('CreatePostInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    content: t.string({ required: false }),
    published: t.boolean({ required: false, defaultValue: false }),
    authorId: t.string({ required: true }),
  }),
});

export const UpdatePostInput = builder.inputType('UpdatePostInput', {
  fields: (t) => ({
    title: t.string({ required: false }),
    content: t.string({ required: false }),
    published: t.boolean({ required: false }),
  }),
});
