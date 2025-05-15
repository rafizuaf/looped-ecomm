import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;

// Utility function to exclude soft deleted records
export function excludeDeleted(queryObject: any = {}) {
  return {
    ...queryObject,
    where: {
      ...queryObject.where,
      deletedAt: null,
    },
  };
}