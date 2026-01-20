import SchemaBuilder from '@pothos/core';
import type { Context } from '../context.js';

export const builder = new SchemaBuilder<{
  Context: Context;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({});

builder.scalarType('DateTime', {
  serialize: (value) => value.toISOString(),
  parseValue: (value) => new Date(value as string),
});

builder.queryType({});
builder.mutationType({});
