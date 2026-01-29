import { builder } from '../builder.js';
import { FavoriteType } from '../types/favorite.js';
import { ListingType } from '../types/listing.js';

builder.queryField('myFavorites', (t) =>
  t.field({
    type: [FavoriteType],
    resolve: async (_parent, _args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      return ctx.prisma.favorite.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: 'desc' },
      });
    },
  })
);

builder.queryField('favoriteListings', (t) =>
  t.field({
    type: [ListingType],
    resolve: async (_parent, _args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      const favorites = await ctx.prisma.favorite.findMany({
        where: { userId: ctx.userId },
        include: { listing: true },
        orderBy: { createdAt: 'desc' },
      });
      return favorites.map((f: { listing: any }) => f.listing);
    },
  })
);

builder.queryField('isFavorite', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      listingId: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) return false;
      const favorite = await ctx.prisma.favorite.findUnique({
        where: {
          userId_listingId: {
            userId: ctx.userId,
            listingId: args.listingId,
          },
        },
      });
      return !!favorite;
    },
  })
);

builder.mutationField('addToFavorites', (t) =>
  t.field({
    type: FavoriteType,
    args: {
      listingId: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      const existing = await ctx.prisma.favorite.findUnique({
        where: {
          userId_listingId: {
            userId: ctx.userId,
            listingId: args.listingId,
          },
        },
      });
      if (existing) {
        return existing;
      }
      return ctx.prisma.favorite.create({
        data: {
          userId: ctx.userId,
          listingId: args.listingId,
        },
      });
    },
  })
);

builder.mutationField('removeFromFavorites', (t) =>
  t.field({
    type: FavoriteType,
    nullable: true,
    args: {
      listingId: t.arg.string({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      const existing = await ctx.prisma.favorite.findUnique({
        where: {
          userId_listingId: {
            userId: ctx.userId,
            listingId: args.listingId,
          },
        },
      });
      if (!existing) {
        return null;
      }
      return ctx.prisma.favorite.delete({
        where: { id: existing.id },
      });
    },
  })
);
