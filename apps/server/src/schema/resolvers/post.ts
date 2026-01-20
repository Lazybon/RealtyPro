import { builder } from '../builder.js';
import { PostType, CreatePostInput, UpdatePostInput } from '../types/post.js';

builder.queryField('posts', (t) =>
  t.field({
    type: [PostType],
    args: {
      published: t.arg.boolean({ required: false }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.post.findMany({
        where: args.published !== null ? { published: args.published } : undefined,
        orderBy: { createdAt: 'desc' },
      });
    },
  })
);

builder.queryField('post', (t) =>
  t.field({
    type: PostType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.post.findUnique({
        where: { id: String(args.id) },
      });
    },
  })
);

builder.mutationField('createPost', (t) =>
  t.field({
    type: PostType,
    args: {
      input: t.arg({ type: CreatePostInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.post.create({
        data: {
          title: args.input.title,
          content: args.input.content,
          published: args.input.published ?? false,
          authorId: args.input.authorId,
        },
      });
    },
  })
);

builder.mutationField('updatePost', (t) =>
  t.field({
    type: PostType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdatePostInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.post.update({
        where: { id: String(args.id) },
        data: {
          ...(args.input.title && { title: args.input.title }),
          ...(args.input.content !== undefined && { content: args.input.content }),
          ...(args.input.published !== undefined && { published: args.input.published }),
        },
      });
    },
  })
);

builder.mutationField('deletePost', (t) =>
  t.field({
    type: PostType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.post.delete({
        where: { id: String(args.id) },
      });
    },
  })
);

builder.mutationField('publishPost', (t) =>
  t.field({
    type: PostType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.post.update({
        where: { id: String(args.id) },
        data: { published: true },
      });
    },
  })
);
