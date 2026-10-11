"use server";

import { prisma } from "@/lib/prisma";
import {
  getTablePagination,
  resolveTableSort,
  TABLE_PAGE_SIZE,
} from "@/components/table/pagination";

export const getReturns = async (
  requestedPage = 1,
  sortField?: string,
  sortDirection?: string,
) => {
  const totalItems = await prisma.orderReturn.count();
  const pagination = getTablePagination(requestedPage, totalItems);
  const sorting = resolveTableSort(
    sortField,
    sortDirection,
    ["refundAmount"],
  );
  const data = await prisma.orderReturn.findMany({
    orderBy: sorting
      ? [{ refundAmount: sorting.direction }, { id: "asc" }]
      : [{ createdAt: "desc" }, { id: "asc" }],
    skip: (pagination.page - 1) * TABLE_PAGE_SIZE,
    take: TABLE_PAGE_SIZE,
    include: {
      order: {
        select: {
          orderNumber: true,
          customerName: true,
        },
      },
    },
  });

  return { data, pagination, sorting };
};

export const getOneReturn = async (id: string) => {
  return prisma.orderReturn.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
      order: {
        select: {
          orderNumber: true,
        },
      },
    },
  });
};
