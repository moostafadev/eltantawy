"use server";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const getCategoriesForStore = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      title: "desc",
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
        take: 8,
        select: {
          id: true,
          title: true,
          image: true,
          price: true,
          discountPrice: true,
          unit: true,
          saleType: true,
          status: true,
          weightOptions: {
            select: {
              id: true,
              name: true,
              minWeight: true,
              maxWeight: true,
            },
          },
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
    saleType: "NORMAL" | "WEIGHT_RANGE";
    status: "AVAILABLE" | "HIDDEN" | "OUT_OF_STOCK";
    weightOptions: {
      id: string;
      name: string;
      minWeight: number;
      maxWeight: number;
    }[];
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

/**
 * Returns a lightweight set of root categories for the home page, including
 * the total count of products in each subtree (recursively), without loading
 * product lists or the complete nested category tree.
 *
 * Only root categories are returned; each count includes direct products
 * plus every product in descendant categories.
 *
 * NOTE: we do NOT filter by `status` inside the query. Prisma + MongoDB's
 * `not: "HIDDEN"` does not match legacy documents that have no `status`
 * field at all, which would zero out every count and hide the section.
 */
export const getHomeCategories = async (limit = 6) =>
  unstable_cache(
    () => fetchHomeCategories(limit),
    // v2: bumped so a fresh cache entry replaces the previously empty one.
    ["home-categories-v2", String(limit)],
    { revalidate: 300, tags: ["home-categories"] },
  )();

type HomeCategoryNode = {
  id: string;
  title: string;
  image: string | null;
  parentId: string | null;
  productsCount: number;
  totalProductsCount: number;
  children: HomeCategoryNode[];
};

const fetchHomeCategories = async (limit: number) => {
  /*
   * Fetch every category once, with its direct product count. The tree is
   * then built in memory, so the recursion covers any depth of nesting.
   */
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      image: true,
      parentId: true,
      _count: {
        select: { products: true },
      },
    },
  });

  const nodeMap = new Map<string, HomeCategoryNode>();

  for (const category of categories) {
    nodeMap.set(category.id, {
      id: category.id,
      title: category.title,
      image: category.image,
      parentId: category.parentId,
      productsCount: category._count.products,
      totalProductsCount: category._count.products,
      children: [],
    });
  }

  const roots: HomeCategoryNode[] = [];

  for (const category of categories) {
    const node = nodeMap.get(category.id);

    if (!node) continue;

    if (category.parentId) {
      const parent = nodeMap.get(category.parentId);

      if (parent) {
        parent.children.push(node);
      } else {
        // Orphan category (parent missing) — treat as a root so it is
        // not silently dropped.
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  const calculateTotal = (node: HomeCategoryNode): number => {
    const childrenTotal = node.children.reduce(
      (sum, child) => sum + calculateTotal(child),
      0,
    );

    node.totalProductsCount = node.productsCount + childrenTotal;

    return node.totalProductsCount;
  };

  roots.forEach(calculateTotal);

  return roots
    .filter((root) => root.totalProductsCount > 0)
    .sort((a, b) => b.totalProductsCount - a.totalProductsCount)
    .slice(0, limit)
    .map((root) => ({
      id: root.id,
      title: root.title,
      image: root.image,
      totalProductsCount: root.totalProductsCount,
    }));
};
