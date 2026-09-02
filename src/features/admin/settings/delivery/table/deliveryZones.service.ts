"use server";

import { prisma } from "@/lib/prisma";

export const getDeliveryZones = async () => {
  return prisma.deliveryZone.findMany({
    orderBy: {
      createdAt: "desc",
    },
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
