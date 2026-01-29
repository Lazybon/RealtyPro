import { builder } from '../builder.js';
import { ListingType, CreateListingInput, UpdateListingInput } from '../types/listing.js';

builder.queryField('listings', (t) =>
  t.field({
    type: [ListingType],
    args: {
      published: t.arg.boolean({ required: false }),
      city: t.arg.string({ required: false }),
      userId: t.arg.string({ required: false }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.listing.findMany({
        where: {
          ...(args.published !== null && args.published !== undefined && { published: args.published }),
          ...(args.city && { city: args.city }),
          ...(args.userId && { userId: args.userId }),
        },
        orderBy: { createdAt: 'desc' },
      });
    },
  })
);

builder.queryField('listing', (t) =>
  t.field({
    type: ListingType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      return ctx.prisma.listing.findUnique({
        where: { id: String(args.id) },
      });
    },
  })
);

builder.queryField('myListings', (t) =>
  t.field({
    type: [ListingType],
    resolve: async (_parent, _args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      return ctx.prisma.listing.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: 'desc' },
      });
    },
  })
);

builder.mutationField('createListing', (t) =>
  t.field({
    type: ListingType,
    args: {
      input: t.arg({ type: CreateListingInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      return ctx.prisma.listing.create({
        data: {
          userId: ctx.userId,
          title: args.input.title,
          description: args.input.description,
          propertyType: args.input.propertyType,
          dealType: args.input.dealType,
          price: args.input.price,
          currency: args.input.currency || 'RUB',
          area: args.input.area,
          rooms: args.input.rooms,
          floor: args.input.floor,
          totalFloors: args.input.totalFloors,
          address: args.input.address,
          city: args.input.city,
          district: args.input.district,
          metroStation: args.input.metroStation,
          images: args.input.images || [],
          published: args.input.published || false,
        },
      });
    },
  })
);

builder.mutationField('updateListing', (t) =>
  t.field({
    type: ListingType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateListingInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      const listing = await ctx.prisma.listing.findUnique({
        where: { id: String(args.id) },
      });
      if (!listing || listing.userId !== ctx.userId) {
        throw new Error('Объявление не найдено или нет прав на редактирование');
      }
      return ctx.prisma.listing.update({
        where: { id: String(args.id) },
        data: {
          ...(args.input.title !== undefined && { title: args.input.title }),
          ...(args.input.description !== undefined && { description: args.input.description }),
          ...(args.input.propertyType !== undefined && { propertyType: args.input.propertyType }),
          ...(args.input.dealType !== undefined && { dealType: args.input.dealType }),
          ...(args.input.price !== undefined && { price: args.input.price }),
          ...(args.input.currency !== undefined && { currency: args.input.currency }),
          ...(args.input.area !== undefined && { area: args.input.area }),
          ...(args.input.rooms !== undefined && { rooms: args.input.rooms }),
          ...(args.input.floor !== undefined && { floor: args.input.floor }),
          ...(args.input.totalFloors !== undefined && { totalFloors: args.input.totalFloors }),
          ...(args.input.address !== undefined && { address: args.input.address }),
          ...(args.input.city !== undefined && { city: args.input.city }),
          ...(args.input.district !== undefined && { district: args.input.district }),
          ...(args.input.metroStation !== undefined && { metroStation: args.input.metroStation }),
          ...(args.input.images !== undefined && { images: args.input.images }),
          ...(args.input.published !== undefined && { published: args.input.published }),
        },
      });
    },
  })
);

builder.mutationField('deleteListing', (t) =>
  t.field({
    type: ListingType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      const listing = await ctx.prisma.listing.findUnique({
        where: { id: String(args.id) },
      });
      if (!listing || listing.userId !== ctx.userId) {
        throw new Error('Объявление не найдено или нет прав на удаление');
      }
      return ctx.prisma.listing.delete({
        where: { id: String(args.id) },
      });
    },
  })
);

builder.mutationField('publishListing', (t) =>
  t.field({
    type: ListingType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
      published: t.arg.boolean({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      const listing = await ctx.prisma.listing.findUnique({
        where: { id: String(args.id) },
      });
      if (!listing || listing.userId !== ctx.userId) {
        throw new Error('Объявление не найдено или нет прав');
      }
      return ctx.prisma.listing.update({
        where: { id: String(args.id) },
        data: { published: args.published },
      });
    },
  })
);
