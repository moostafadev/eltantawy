"use server";

import { prisma } from "@/lib/prisma";
import {
  getTablePagination,
  resolveTableSort,
  TABLE_PAGE_SIZE,
} from "@/components/table/pagination";

const sortableDiscountFields = ["value", "usageCount"] as const;

export const getDiscounts = async (
  requestedPage = 1,
  sortField?: string,
  sortDirection?: string,
) => {
  const totalItems = await prisma.discount.count();
  const pagination = getTablePagination(requestedPage, totalItems);
  const sorting = resolveTableSort(
    sortField,
    sortDirection,
    sortableDiscountFields,
  );
  const orderBy = sorting?.field === "value"
    ? [{ value: sorting.direction }, { id: "asc" as const }]
    : sorting?.field === "usageCount"
      ? [{ usageCount: sorting.direction }, { id: "asc" as const }]
      : [{ createdAt: "desc" as const }, { id: "asc" as const }];
  const data = await prisma.discount.findMany({
    orderBy,
    skip: (pagination.page - 1) * TABLE_PAGE_SIZE,
    take: TABLE_PAGE_SIZE,
  });

  return { data, pagination, sorting };
};

export const getOneDiscount = async (id: string) => {
  return prisma.discount.findUnique({
    where: {
      id,
    },
  });
};
