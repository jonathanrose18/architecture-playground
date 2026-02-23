
import 'dotenv/config';
import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';

import { PrismaClient } from './generated/prisma';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const url = process.env.DATABASE_URL;

if(!url) {
    throw new Error("DATABASE_URL in packages/database is not configured.")
}

const adapter = new PrismaBetterSQLite3({ url });

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from './generated/prisma';