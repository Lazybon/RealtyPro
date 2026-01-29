import { builder } from './builder.js';
import './types/user.js';
import './types/listing.js';
import './types/favorite.js';
import './types/deal.js';
import './resolvers/user.js';
import './resolvers/listing.js';
import './resolvers/favorite.js';
import './resolvers/deal.js';

export const schema = builder.toSchema();
