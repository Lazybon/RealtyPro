import { builder } from './builder.js';
import './types/user.js';
import './types/post.js';
import './resolvers/user.js';
import './resolvers/post.js';

export const schema = builder.toSchema();
