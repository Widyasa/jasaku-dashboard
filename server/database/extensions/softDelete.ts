import { PrismaClient } from "@prisma/client";

const SOFT_DELETE_MODELS = [
  "User",
  "Category",
  "Service",
  "Order",
  "FinanceRecord",
] as const;

type SoftDeleteModel = (typeof SOFT_DELETE_MODELS)[number];

function isSoftDeleteModel(
  model: string,
): model is Uncapitalize<SoftDeleteModel> {
  const capitalized = model.charAt(0).toUpperCase() + model.slice(1);
  return (SOFT_DELETE_MODELS as readonly string[]).includes(capitalized);
}

export function createSoftDeleteExtension(prisma: PrismaClient) {
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (!isSoftDeleteModel(model)) return query(args);
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (!isSoftDeleteModel(model)) return query(args);
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async findUnique({ model, args, query }) {
          if (!isSoftDeleteModel(model)) return query(args);
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async count({ model, args, query }) {
          if (!isSoftDeleteModel(model)) return query(args);
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async update({ model, args, query }) {
          if (!isSoftDeleteModel(model)) return query(args);
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
        async updateMany({ model, args, query }) {
          if (!isSoftDeleteModel(model)) return query(args);
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        },
      },
    },
  });
}
