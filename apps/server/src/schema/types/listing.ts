import { builder } from '../builder.js';
import { UserType } from './user.js';

export const ListingType = builder.objectRef<{
  id: string;
  userId: string;
  title: string;
  description: string | null;
  propertyType: string;
  dealType: string;
  price: number;
  currency: string;
  area: number;
  rooms: number;
  floor: number | null;
  totalFloors: number | null;
  address: string;
  city: string;
  district: string | null;
  metroStation: string | null;
  images: string[];
  published: boolean;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}>('Listing');

ListingType.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    userId: t.exposeString('userId'),
    title: t.exposeString('title'),
    description: t.exposeString('description', { nullable: true }),
    propertyType: t.exposeString('propertyType'),
    dealType: t.exposeString('dealType'),
    price: t.exposeFloat('price'),
    currency: t.exposeString('currency'),
    area: t.exposeFloat('area'),
    rooms: t.exposeInt('rooms'),
    floor: t.exposeInt('floor', { nullable: true }),
    totalFloors: t.exposeInt('totalFloors', { nullable: true }),
    address: t.exposeString('address'),
    city: t.exposeString('city'),
    district: t.exposeString('district', { nullable: true }),
    metroStation: t.exposeString('metroStation', { nullable: true }),
    images: t.exposeStringList('images'),
    published: t.exposeBoolean('published'),
    viewsCount: t.exposeInt('viewsCount'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    user: t.field({
      type: UserType,
      resolve: async (parent, _args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: { id: parent.userId },
        });
        return user!;
      },
    }),
  }),
});

export const CreateListingInput = builder.inputType('CreateListingInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    description: t.string({ required: false }),
    propertyType: t.string({ required: true }),
    dealType: t.string({ required: true }),
    price: t.float({ required: true }),
    currency: t.string({ required: false }),
    area: t.float({ required: true }),
    rooms: t.int({ required: true }),
    floor: t.int({ required: false }),
    totalFloors: t.int({ required: false }),
    address: t.string({ required: true }),
    city: t.string({ required: true }),
    district: t.string({ required: false }),
    metroStation: t.string({ required: false }),
    images: t.stringList({ required: false }),
    published: t.boolean({ required: false }),
  }),
});

export const UpdateListingInput = builder.inputType('UpdateListingInput', {
  fields: (t) => ({
    title: t.string({ required: false }),
    description: t.string({ required: false }),
    propertyType: t.string({ required: false }),
    dealType: t.string({ required: false }),
    price: t.float({ required: false }),
    currency: t.string({ required: false }),
    area: t.float({ required: false }),
    rooms: t.int({ required: false }),
    floor: t.int({ required: false }),
    totalFloors: t.int({ required: false }),
    address: t.string({ required: false }),
    city: t.string({ required: false }),
    district: t.string({ required: false }),
    metroStation: t.string({ required: false }),
    images: t.stringList({ required: false }),
    published: t.boolean({ required: false }),
  }),
});
