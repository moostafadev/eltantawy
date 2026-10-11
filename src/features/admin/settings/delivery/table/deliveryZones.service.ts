"use server";

import { prisma } from "@/lib/prisma";
import {
  getTablePagination,
  resolveTableSort,
  TABLE_PAGE_SIZE,
} from "@/components/table/pagination";

const sortableDeliveryFields = ["cost", "childrenCount"] as const;

export const getDeliveryZones = async (
  requestedPage = 1,
  sortField?: string,
  sortDirection?: string,
) => {
  const totalItems = await prisma.deliveryZone.count();
  const pagination = getTablePagination(requestedPage, totalItems);
  const sorting = resolveTableSort(
    sortField,
    sortDirection,
    sortableDeliveryFields,
  );
  const rows = await prisma.deliveryZone.findMany({
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
          children: true,
        },
      },
    },
  });
  const data = sorting
    ? rows
        .sort((a, b) => {
          const aValue =
            sorting.field === "cost" ? (a.cost ?? -Infinity) : a._count.children;
          const bValue =
            sorting.field === "cost" ? (b.cost ?? -Infinity) : b._count.children;
          const difference = aValue - bValue;
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

export const getOneDeliveryZone = async (id: string) => {
  return prisma.deliveryZone.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      cost: true,
      isActive: true,
      parentId: true,

      parent: {
        select: {
          id: true,
          title: true,
        },
      },

      _count: {
        select: {
          children: true,
        },
      },

      createdAt: true,
    },
  });
};

export const getDeliveryZonesForParentSelect = async () => {
  return prisma.deliveryZone.findMany({
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
      parentId: true,
      cost: true,
      isActive: true,
      _count: {
        select: {
          children: true,
        },
      },
    },
  });
};

export const getDeliveryZonesForGraph = async () => {
  return prisma.deliveryZone.findMany({
    select: {
      id: true,
      title: true,
      parentId: true,
      cost: true,
      isActive: true,
      _count: {
        select: {
          children: true,
        },
      },
    },
  });
};

/**
 * Returns delivery zones available for selection at checkout: active leaf
 * zones with a defined delivery fee.
 */
export const getActiveDeliveryZonesForCheckout = async () => {
  const zones = await prisma.deliveryZone.findMany({
    where: {
      isActive: true,
      cost: {
        not: null,
      },
    },
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
      cost: true,
    },
  });

  return zones.map((zone) => ({
    id: zone.id,
    title: zone.title,
    cost: zone.cost as number,
  }));
};
