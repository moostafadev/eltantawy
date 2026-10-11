"use server";

import { prisma } from "@/lib/prisma";
import {
  getTablePagination,
  resolveTableSort,
  TABLE_PAGE_SIZE,
  type TableSortState,
} from "@/components/table/pagination";

import { OrderStatusEnum } from "./types";

const sortableOrderFields = ["orderNumber", "total"] as const;

const getOrderOrderBy = (sorting: TableSortState) => {
  switch (sorting.field) {
    case "orderNumber":
      return [{ orderNumber: sorting.direction }, { id: "asc" as const }];
    case "total":
      return [{ total: sorting.direction }, { id: "asc" as const }];
    default:
      return [{ createdAt: "desc" as const }, { id: "asc" as const }];
  }
};

export const getOrders = async (
  requestedPage = 1,
  sortField?: string,
  sortDirection?: string,
) => {
  const totalItems = await prisma.order.count();
  const pagination = getTablePagination(requestedPage, totalItems);
  const sorting = resolveTableSort(
    sortField,
    sortDirection,
    sortableOrderFields,
  );
  const orderBy = sorting
    ? getOrderOrderBy(sorting)
    : getOrderOrderBy({ field: "createdAt", direction: "desc" });
  const data = await prisma.order.findMany({
    orderBy,
    skip: (pagination.page - 1) * TABLE_PAGE_SIZE,
    take: TABLE_PAGE_SIZE,
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      customerPhone: true,
      deliveryZoneTitle: true,
      total: true,
      status: true,
      paymentMethod: true,
      createdAt: true,
    },
  });

  return { data, pagination, sorting };
};

export const getOneOrder = async (id: string) => {
  return prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
      returns: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

/**
 * Returns the number of orders in each status for the dashboard donut chart.
 */
export const getOrderStatusDistribution = async (): Promise<
  { status: OrderStatusEnum; count: number }[]
> => {
  const statuses: OrderStatusEnum[] = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  const counts = await Promise.all(
    statuses.map((status) =>
      prisma.order.count({
        where: {
          status,
        },
      }),
    ),
  );

  return statuses.map((status, index) => ({
    status,
    count: counts[index],
  }));
};
