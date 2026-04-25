import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __financePrisma: PrismaClient | undefined;
}

export const prisma = global.__financePrisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});

if (process.env.NODE_ENV !== 'production') {
  global.__financePrisma = prisma;
}
