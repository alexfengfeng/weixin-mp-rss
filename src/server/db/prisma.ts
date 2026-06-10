import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function enableSqliteWal() {
  try {
    await prisma.$executeRawUnsafe("PRAGMA journal_mode=WAL;");
    await prisma.$executeRawUnsafe("PRAGMA busy_timeout=5000;");
  } catch {
    // WAL is a best-effort optimization; app startup should not fail if unavailable.
  }
}
