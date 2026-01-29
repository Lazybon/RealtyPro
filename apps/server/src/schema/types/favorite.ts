import { builder } from '../builder.js';
import { ListingType } from './listing.js';
import { UserType } from './user.js';

export const FavoriteType = builder.objectRef<{
  id: string;
  userId: string;
  listingId: string;
  createdAt: Date;
}>('Favorite');

FavoriteType.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    userId: t.exposeString('userId'),
    listingId: t.exposeString('listingId'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    user: t.field({
      type: UserType,
      resolve: async (parent, _args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: { id: parent.userId },
        });
        return user!;
      },
    }),
    listing: t.field({
      type: ListingType,
      resolve: async (parent, _args, ctx) => {
        const listing = await ctx.prisma.listing.findUnique({
          where: { id: parent.listingId },
        });
        return listing!;
      },
    }),
  }),
});
