"use server";

import { prisma } from "@/lib/prisma";
import {
  getTablePagination,
  resolveTableSort,
  TABLE_PAGE_SIZE,
} from "@/components/table/pagination";

export const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: {
      id: true,
      fName: true,
      lName: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });
};

/**
 * Groups guest orders (`userId = null`) by phone number so they can appear
 * as users in the admin table even though they do not have a User account.
 *
 * Grouping is done in memory because the expected guest-order volume is
 * relatively small and this approach is fully compatible with MongoDB.
 */
export const getGuestUsers = async () => {
  const guestOrders = await prisma.order.findMany({
    where: {
      userId: null,
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    select: {
      customerName: true,
      customerPhone: true,
      createdAt: true,
    },
  });

  const map = new Map<
    string,
    {
      customerName: string;
      customerPhone: string;
      createdAt: Date;
      ordersCount: number;
    }
  >();

  for (const order of guestOrders) {
    const existing = map.get(order.customerPhone);

    if (existing) {
      existing.ordersCount += 1;

      // Keep the latest guest name and activity date.
      if (order.createdAt > existing.createdAt) {
        existing.createdAt = order.createdAt;
        existing.customerName = order.customerName;
      }

      continue;
    }

    map.set(order.customerPhone, {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      createdAt: order.createdAt,
      ordersCount: 1,
    });
  }

  return Array.from(map.values());
};

export const getUsersPage = async (
  requestedPage = 1,
  sortField?: string,
  sortDirection?: string,
) => {
  const [registeredUsersCount, guests] = await Promise.all([
    prisma.user.count(),
    getGuestUsers(),
  ]);
  const sorting = resolveTableSort(
    sortField,
    sortDirection,
    ["ordersCount"],
  );
  const pagination = getTablePagination(
    requestedPage,
    registeredUsersCount + guests.length,
  );
  const candidateCount = sorting
    ? registeredUsersCount
    : pagination.page * TABLE_PAGE_SIZE;
  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: candidateCount,
    select: {
      id: true,
      fName: true,
      lName: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  const rows = [
    ...users.map((user) => ({ kind: "REGISTERED" as const, data: user })),
    ...guests.map((guest) => ({ kind: "GUEST" as const, data: guest })),
  ];
  rows.sort((a, b) => {
    if (sorting?.field === "ordersCount") {
      const aCount =
        a.kind === "REGISTERED" ? a.data._count.orders : a.data.ordersCount;
      const bCount =
        b.kind === "REGISTERED" ? b.data._count.orders : b.data.ordersCount;
      const difference = aCount - bCount;

      if (difference !== 0) {
        return sorting.direction === "asc" ? difference : -difference;
      }
    }

    const createdAtDifference =
      new Date(b.data.createdAt).getTime() -
      new Date(a.data.createdAt).getTime();
    if (createdAtDifference !== 0) return createdAtDifference;
    if (a.kind !== b.kind) {
      return a.kind === "REGISTERED" ? -1 : 1;
    }

    const aKey = a.kind === "REGISTERED" ? a.data.id : a.data.customerPhone;
    const bKey = b.kind === "REGISTERED" ? b.data.id : b.data.customerPhone;
    return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
  });

  return {
    data: rows.slice(
      (pagination.page - 1) * TABLE_PAGE_SIZE,
      pagination.page * TABLE_PAGE_SIZE,
    ),
    pagination,
    sorting,
  };
};
