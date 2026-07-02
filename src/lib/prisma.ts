import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

import path from 'path';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

if (typeof window === 'undefined') {
  const dbPath = path.resolve(process.cwd(), 'database', 'lms.db');
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  prismaClient = new PrismaClient({ adapter });
} else {
  prismaClient = {} as PrismaClient;
}

export const prisma = globalForPrisma.prisma || prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
