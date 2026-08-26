"use server";

import { prisma } from "@/lib/prisma";

export const getCategories = async () => {
  return prisma.category.findMany({
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
          products: true,
          children: true,
        },
      },
    },
  });
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
    },
  });
};

export const getCategoriesForGraph = async () => {
  return prisma.category.findMany({
    select: {
      id: true,
      title: true,
      parentId: true,
    },
  });
};
