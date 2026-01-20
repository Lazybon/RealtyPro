import { builder } from './builder.js';
import './types/user.js';
import './resolvers/user.js';

export const schema = builder.toSchema();
