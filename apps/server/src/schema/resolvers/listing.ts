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
      // Build update data, filtering out null/undefined for required fields
      const updateData: Record<string, unknown> = {};
      
      // Required fields - only update if not null/undefined
      if (args.input.title != null) updateData.title = args.input.title;
      if (args.input.propertyType != null) updateData.propertyType = args.input.propertyType;
      if (args.input.dealType != null) updateData.dealType = args.input.dealType;
      if (args.input.price != null) updateData.price = args.input.price;
      if (args.input.currency != null) updateData.currency = args.input.currency;
      if (args.input.area != null) updateData.area = args.input.area;
      if (args.input.rooms != null) updateData.rooms = args.input.rooms;
      if (args.input.address != null) updateData.address = args.input.address;
      if (args.input.city != null) updateData.city = args.input.city;
      
      // Nullable fields - can be set to null explicitly
      if (args.input.description !== undefined) updateData.description = args.input.description;
      if (args.input.floor !== undefined) updateData.floor = args.input.floor;
      if (args.input.totalFloors !== undefined) updateData.totalFloors = args.input.totalFloors;
      if (args.input.district !== undefined) updateData.district = args.input.district;
      if (args.input.metroStation !== undefined) updateData.metroStation = args.input.metroStation;
      if (args.input.images !== undefined) updateData.images = args.input.images;
      if (args.input.published !== undefined) updateData.published = args.input.published;
      
      return ctx.prisma.listing.update({
        where: { id: String(args.id) },
        data: updateData,
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
