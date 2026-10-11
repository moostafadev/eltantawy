"use server";

import { prisma } from "@/lib/prisma";
import {
  getTablePagination,
  resolveTableSort,
  TABLE_PAGE_SIZE,
  type TableSortDirection,
  type TableSortState,
} from "@/components/table/pagination";

const sortableProductFields = ["price", "discountPrice"] as const;

const getProductOrderBy = (sorting: TableSortState) => {
  const direction: TableSortDirection = sorting.direction;

  switch (sorting.field) {
    case "price":
      return [{ price: direction }, { id: "asc" as const }];
    case "discountPrice":
      return [{ discountPrice: direction }, { id: "asc" as const }];
    default:
      return [{ createdAt: "desc" as const }, { id: "asc" as const }];
  }
};

export const getProducts = async (
  requestedPage = 1,
  sortField?: string,
  sortDirection?: string,
) => {
  const totalItems = await prisma.product.count();
  const pagination = getTablePagination(requestedPage, totalItems);
  const sorting = resolveTableSort(
    sortField,
    sortDirection,
    sortableProductFields,
  );
  const orderBy = sorting
    ? getProductOrderBy(sorting)
    : getProductOrderBy({ field: "createdAt", direction: "desc" });
  const data = await prisma.product.findMany({
    orderBy,
    skip: (pagination.page - 1) * TABLE_PAGE_SIZE,
    take: TABLE_PAGE_SIZE,
    include: {
      category: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return { data, pagination, sorting };
};

export const getProductsByCategory = async (
  categoryId: string,
  requestedPage = 1,
  sortField?: string,
  sortDirection?: string,
) => {
  const where = { categoryId };
  const totalItems = await prisma.product.count({ where });
  const pagination = getTablePagination(requestedPage, totalItems);
  const sorting = resolveTableSort(
    sortField,
    sortDirection,
    sortableProductFields,
  );
  const orderBy = sorting
    ? getProductOrderBy(sorting)
    : getProductOrderBy({ field: "createdAt", direction: "desc" });
  const data = await prisma.product.findMany({
    where,
    orderBy,
    skip: (pagination.page - 1) * TABLE_PAGE_SIZE,
    take: TABLE_PAGE_SIZE,
    include: {
      category: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return { data, pagination, sorting };
};

export const getOneProduct = async (id: string) => {
  return prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      desc: true,
      image: true,
      price: true,
      discountPrice: true,
      discountValueType: true,
      discountValue: true,
      unit: true,
      saleType: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          title: true,
        },
      },
      weightOptions: {
        select: {
          id: true,
          name: true,
          minWeight: true,
          maxWeight: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
};
