import { prisma, type PrismaClient } from './lib/prisma.js';

export interface Context {
  prisma: PrismaClient;
  userId?: string;
}

export interface ContextFunctionParams {
  req: {
    headers: Map<string, string> | Record<string, string | string[] | undefined>;
  };
}

export async function createContext({ req }: ContextFunctionParams): Promise<Context> {
  const headers = req.headers;
  let userId: string | undefined;
  
  if (headers instanceof Map) {
    userId = headers.get('x-user-id') || undefined;
  } else {
    const headerValue = headers['x-user-id'];
    userId = Array.isArray(headerValue) ? headerValue[0] : headerValue || undefined;
  }
  
  return {
    prisma,
    userId,
  };
}
