import { prisma } from "../database";

type SoftDeleteModel =
  | "user"
  | "category"
  | "service"
  | "order"
  | "financeRecord";

type PrismaArgs = {
  where?: Record<string, unknown>;
  select?: Record<string, unknown>;
  include?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
  take?: number;
  skip?: number;
};

//change the function of delete function on prisma
export async function softDelete<T extends SoftDeleteModel>(
  model: T,
  where: Record<string, unknown>,
) {
  const client = (prisma as Record<string, any>)[model];

  return client.update({
    where: { ...where, deletedAt: null },
    data: { deletedAt: new Date() },
  });
}

//change the function of deleteMany function on prisma
export async function softDeleteMany<T extends SoftDeleteModel>(
  model: T,
  where: Record<string, unknown>,
) {
  const client = (prisma as Record<string, any>)[model];

  return client.updateMany({
    where: { ...where, deletedAt: null },
    data: { deletedAt: new Date() },
  });
}

//restore deleted data
export async function restore<T extends SoftDeleteModel>(
  model: T,
  where: Record<string, unknown>,
) {
  const client = (prisma as Record<string, any>)[model];

  return client.update({
    where: { ...where, deletedAt: { not: null } },
    data: { deletedAt: null },
  });
}

//see deleted data
export async function findDeleted<T extends SoftDeleteModel>(
  model: T,
  args: PrismaArgs = {},
) {
  const client = (prisma as Record<string, any>)[model];

  return client.findMany({
    ...args,
    where: { ...args.where, deletedAt: { not: null } },
  });
}

//look all data (even the deleted data) and only for admin
export async function findAllWithDeleted<T extends SoftDeleteModel>(
  model: T,
  args: Record<string, unknown>,
) {
  const client = (prisma as Record<string, any>)[model];

  return client.findMany(args);
}
