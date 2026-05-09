import { PrismaClient } from "@prisma/client";
import { createSoftDeleteExtension } from "./extensions/softDelete";
const globalForPrisma = globalThis as { prisma?: PrismaClient };
const basePrisma = globalForPrisma.prisma ?? new PrismaClient();

export const prisma = createSoftDeleteExtension(basePrisma);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = basePrisma;
}
