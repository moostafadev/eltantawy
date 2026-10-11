"use server";

import { prisma } from "@/lib/prisma";
import {
  getTablePagination,
  resolveTableSort,
  TABLE_PAGE_SIZE,
  type TableSortState,
} from "@/components/table/pagination";

const sortableCategoryFields = ["productCount", "childrenCount"] as const;

export const getCategories = async (
  requestedPage = 1,
  sortField?: string,
  sortDirection?: string,
) => {
  const totalItems = await prisma.category.count();
  const pagination = getTablePagination(requestedPage, totalItems);
  const sorting = resolveTableSort(
    sortField,
    sortDirection,
    sortableCategoryFields,
  );
  const rows = await prisma.category.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    ...(sorting
      ? {}
      : {
          skip: (pagination.page - 1) * TABLE_PAGE_SIZE,
          take: TABLE_PAGE_SIZE,
        }),
    include: {
      parent: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: {
          products: true,
          children: true,
        },
      },
    },
  });
  const data = sorting
    ? rows
        .sort((a, b) => {
          const aCount =
            sorting.field === "productCount"
              ? a._count.products
              : a._count.children;
          const bCount =
            sorting.field === "productCount"
              ? b._count.products
              : b._count.children;
          const difference = aCount - bCount;
          return difference === 0
            ? a.id.localeCompare(b.id)
            : sorting.direction === "asc"
              ? difference
              : -difference;
        })
        .slice(
          (pagination.page - 1) * TABLE_PAGE_SIZE,
          pagination.page * TABLE_PAGE_SIZE,
        )
    : rows;

  return { data, pagination, sorting };
};

export const getOneCategory = async (id: string) => {
  return prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      desc: true,
      image: true,
      parentId: true,

      parent: {
        select: {
          id: true,
          title: true,
        },
      },

      _count: {
        select: {
          products: true,
          children: true,
        },
      },

      createdAt: true,
    },
  });
};

export const getCategoryParents = async () => {
  return prisma.category.findMany({
    where: {
      parentId: null,
    },
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
    },
  });
};

export const getCategoriesForParentSelect = async () => {
  return prisma.category.findMany({
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
      parentId: true,
      _count: {
        select: {
          products: true,
          children: true,
        },
      },
    },
  });
};

export const getCategoriesForGraph = async () => {
  return prisma.category.findMany({
    select: {
      id: true,
      title: true,
      parentId: true,
      _count: {
        select: {
          products: true,
          children: true,
        },
      },
    },
  });
};
