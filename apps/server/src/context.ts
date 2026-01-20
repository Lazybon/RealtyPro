import { prisma, type PrismaClient } from './lib/prisma.js';

export interface Context {
  prisma: PrismaClient;
  userId?: string;
}

export async function createContext(): Promise<Context> {
  return {
    prisma,
    userId: undefined,
  };
}
