export const config = {
  api: {
    port: parseInt(process.env.PORT || '4000', 10),
    graphqlPath: '/graphql',
  },
  web: {
    port: 5000,
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/fullstack_db',
  },
};

export type Config = typeof config;
