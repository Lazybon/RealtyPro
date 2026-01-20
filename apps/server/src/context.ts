import { prisma, type PrismaClient } from './lib/prisma.js';

export interface Context {
  prisma: PrismaClient;
}

export async function createContext(): Promise<Context> {
  return {
    prisma,
  };
}
