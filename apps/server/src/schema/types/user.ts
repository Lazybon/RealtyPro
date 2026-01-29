import { builder } from '../builder.js';

export const UserType = builder.objectRef<{
  id: string;
  email: string | null;
  password?: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}>('User');

UserType.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email', { nullable: true }),
    firstName: t.exposeString('firstName', { nullable: true }),
    lastName: t.exposeString('lastName', { nullable: true }),
    phone: t.exposeString('phone', { nullable: true }),
    profileImageUrl: t.exposeString('profileImageUrl', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

export const AuthPayloadType = builder.objectRef<{
  user: {
    id: string;
    email: string | null;
    password?: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    profileImageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
}>('AuthPayload');

AuthPayloadType.implement({
  fields: (t) => ({
    user: t.field({
      type: UserType,
      resolve: (parent) => parent.user,
    }),
    token: t.exposeString('token'),
  }),
});

export const RegisterInput = builder.inputType('RegisterInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    firstName: t.string({ required: false }),
    lastName: t.string({ required: false }),
  }),
});

export const LoginInput = builder.inputType('LoginInput', {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
  }),
});

export const UpdateUserInput = builder.inputType('UpdateUserInput', {
  fields: (t) => ({
    firstName: t.string({ required: false }),
    lastName: t.string({ required: false }),
    phone: t.string({ required: false }),
    profileImageUrl: t.string({ required: false }),
  }),
});
