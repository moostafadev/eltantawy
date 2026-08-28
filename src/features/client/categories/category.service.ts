"use server";

import { prisma } from "@/lib/prisma";

export const getCategoriesForStore = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
      desc: true,
      image: true,
      parentId: true,
      _count: {
        select: {
          products: true,
        },
      },
      products: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          image: true,
          price: true,
          discountPrice: true,
          unit: true,
        },
      },
    },
  });

  type Product = {
    id: string;
    title: string;
    image: string | null;
    price: number;
    discountPrice: number | null;
    unit: "KG" | "PIECE";
  };

  type CategoryNode = {
    id: string;
    title: string;
    desc: string | null;
    image: string | null;
    parentId: string | null;
    productsCount: number;
    totalProductsCount: number;
    products: Product[];
    children: CategoryNode[];
  };

  const categoryMap = new Map<string, CategoryNode>();

  categories.forEach((category) => {
    categoryMap.set(category.id, {
      id: category.id,
      title: category.title,
      desc: category.desc,
      image: category.image,
      parentId: category.parentId,
      productsCount: category._count.products,
      totalProductsCount: category._count.products,
      products: category.products,
      children: [],
    });
  });

  const roots: CategoryNode[] = [];

  categories.forEach((category) => {
    const node = categoryMap.get(category.id);

    if (!node) return;

    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);

      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  const calculateTotalProducts = (category: CategoryNode): number => {
    const childrenProducts = category.children.reduce(
      (total, child) => total + calculateTotalProducts(child),
      0,
    );

    category.totalProductsCount = category.productsCount + childrenProducts;

    return category.totalProductsCount;
  };

  roots.forEach(calculateTotalProducts);

  return roots;
};
