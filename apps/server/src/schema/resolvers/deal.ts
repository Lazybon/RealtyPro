import { builder } from '../builder.js';
import { DealType, CreateDealInput, UpdateDealStatusInput } from '../types/deal.js';

builder.queryField('myDeals', (t) =>
  t.field({
    type: [DealType],
    resolve: async (_parent, _args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      return ctx.prisma.deal.findMany({
        where: {
          OR: [
            { buyerId: ctx.userId },
            { sellerId: ctx.userId },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    },
  })
);

builder.queryField('deal', (t) =>
  t.field({
    type: DealType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      const deal = await ctx.prisma.deal.findUnique({
        where: { id: String(args.id) },
      });
      if (!deal || (deal.buyerId !== ctx.userId && deal.sellerId !== ctx.userId)) {
        return null;
      }
      return deal;
    },
  })
);

builder.mutationField('createDeal', (t) =>
  t.field({
    type: DealType,
    args: {
      input: t.arg({ type: CreateDealInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      const listing = await ctx.prisma.listing.findUnique({
        where: { id: args.input.listingId },
      });
      if (!listing) {
        throw new Error('Объявление не найдено');
      }
      if (listing.userId === ctx.userId) {
        throw new Error('Нельзя создать сделку по своему объявлению');
      }
      return ctx.prisma.deal.create({
        data: {
          listingId: args.input.listingId,
          buyerId: ctx.userId,
          sellerId: listing.userId,
          price: args.input.price,
          status: 'pending',
        },
      });
    },
  })
);

builder.mutationField('updateDealStatus', (t) =>
  t.field({
    type: DealType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateDealStatusInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      const deal = await ctx.prisma.deal.findUnique({
        where: { id: String(args.id) },
      });
      if (!deal || (deal.buyerId !== ctx.userId && deal.sellerId !== ctx.userId)) {
        throw new Error('Сделка не найдена или нет прав');
      }
      const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(args.input.status)) {
        throw new Error('Недопустимый статус');
      }
      return ctx.prisma.deal.update({
        where: { id: String(args.id) },
        data: { status: args.input.status },
      });
    },
  })
);

builder.mutationField('cancelDeal', (t) =>
  t.field({
    type: DealType,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      if (!ctx.userId) {
        throw new Error('Необходима авторизация');
      }
      const deal = await ctx.prisma.deal.findUnique({
        where: { id: String(args.id) },
      });
      if (!deal || (deal.buyerId !== ctx.userId && deal.sellerId !== ctx.userId)) {
        throw new Error('Сделка не найдена или нет прав');
      }
      return ctx.prisma.deal.update({
        where: { id: String(args.id) },
        data: { status: 'cancelled' },
      });
    },
  })
);
