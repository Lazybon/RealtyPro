import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './schema/index.js';
import { prisma } from './lib/prisma.js';
import { createContext, type Context } from './context.js';

const server = new ApolloServer<Context>({
  schema,
  introspection: true,
});

const PORT = parseInt(
  process.env.PORT || process.env.SERVER_PORT || '4000',
  10,
);

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT, host: '0.0.0.0' },
    context: createContext,
  });

  console.log(`🚀 Apollo Server ready at ${url}`);
  console.log(`📊 GraphQL Playground available at ${url}`);
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
