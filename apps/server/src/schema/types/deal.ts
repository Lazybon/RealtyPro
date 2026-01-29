import { builder } from '../builder.js';
import { ListingType } from './listing.js';
import { UserType } from './user.js';

export const DealType = builder.objectRef<{
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  status: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}>('Deal');

DealType.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    listingId: t.exposeString('listingId'),
    buyerId: t.exposeString('buyerId'),
    sellerId: t.exposeString('sellerId'),
    status: t.exposeString('status'),
    price: t.exposeFloat('price'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    listing: t.field({
      type: ListingType,
      resolve: async (parent, _args, ctx) => {
        const listing = await ctx.prisma.listing.findUnique({
          where: { id: parent.listingId },
        });
        return listing!;
      },
    }),
    buyer: t.field({
      type: UserType,
      resolve: async (parent, _args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: { id: parent.buyerId },
        });
        return user!;
      },
    }),
    seller: t.field({
      type: UserType,
      resolve: async (parent, _args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: { id: parent.sellerId },
        });
        return user!;
      },
    }),
  }),
});

export const CreateDealInput = builder.inputType('CreateDealInput', {
  fields: (t) => ({
    listingId: t.string({ required: true }),
    price: t.float({ required: true }),
  }),
});

export const UpdateDealStatusInput = builder.inputType('UpdateDealStatusInput', {
  fields: (t) => ({
    status: t.string({ required: true }),
  }),
});
