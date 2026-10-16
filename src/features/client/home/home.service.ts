"use server";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

const MIN_TOP_SELLING_PRODUCTS = 4;
const PRODUCTS_PER_CATEGORY = 2;

const productSelect = {
  id: true,
  title: true,
  image: true,
  price: true,
  discountPrice: true,
  unit: true,
  saleType: true,
  status: true,
  weightOptions: true,
} as const;

type HomeProduct = {
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
    productId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

/**
 * A product is sellable when its status is neither HIDDEN nor OUT_OF_STOCK.
 * A missing `status` field (legacy data) is treated as sellable, because
 * Prisma + MongoDB does not backfill defaults on legacy documents.
 */
const isSellable = (product: { status?: string | null }): boolean =>
  product.status !== "HIDDEN" && product.status !== "OUT_OF_STOCK";

/**
 * Fetches up to `perCategory` sellable products from each category, excluding
 * the given IDs. Products are returned interleaved (one per category first,
 * then a second pass) so the result mixes categories instead of grouping them.
 */
const fetchProductsFromEachCategory = async (
  excludeIds: string[],
  perCategory: number,
): Promise<HomeProduct[]> => {
  const categories = await prisma.category.findMany({
    select: { id: true },
    orderBy: { createdAt: "desc" },
  });

  if (categories.length === 0) {
    return [];
  }

  // Fetch candidates from every category in parallel.
  const perCategoryResults = await Promise.all(
    categories.map((category) =>
      prisma.product.findMany({
        where: {
          categoryId: category.id,
          ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
        },
        select: productSelect,
        orderBy: { createdAt: "desc" },
        // Grab extra so we can drop non-sellable ones and still have enough.
        take: perCategory * 3,
      }),
    ),
  );

  // Keep only the first `perCategory` sellable products per category.
  const buckets = perCategoryResults.map((products) =>
    products.filter(isSellable).slice(0, perCategory),
  );

  // Interleave: one product from each category, then a second round, etc.
  const interleaved: HomeProduct[] = [];
  const seen = new Set<string>();

  for (let round = 0; round < perCategory; round++) {
    for (const bucket of buckets) {
      const product = bucket[round];

      if (product && !seen.has(product.id)) {
        seen.add(product.id);
        interleaved.push(product);
      }
    }
  }

  return interleaved;
};

const fetchTopSellingProducts = async (
  limit: number,
  minimum: number,
): Promise<HomeProduct[]> => {
  /* ------------------------------------------------------------------ */
  /* 1) Rank product IDs by total sales from delivered orders            */
  /* ------------------------------------------------------------------ */
  const topItems = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        status: "DELIVERED",
      },
    },
    _sum: {
      total: true,
    },
    orderBy: {
      _sum: {
        total: "desc",
      },
    },
    take: limit,
  });

  const topIds = topItems.map((item) => item.productId);

  /* ------------------------------------------------------------------ */
  /* 2) Fetch ranked products (no status filter in the query)            */
  /* ------------------------------------------------------------------ */
  let orderedProducts: HomeProduct[] = [];

  if (topIds.length > 0) {
    const products = await prisma.product.findMany({
      where: { id: { in: topIds } },
      select: productSelect,
    });

    const productsMap = new Map(
      products.map((product) => [product.id, product]),
    );

    orderedProducts = topIds
      .map((id) => productsMap.get(id))
      .filter((product): product is HomeProduct =>
        Boolean(product && isSellable(product)),
      );
  }

  /* ------------------------------------------------------------------ */
  /* 3) Top up with products from each category when we're short         */
  /* ------------------------------------------------------------------ */
  if (orderedProducts.length < minimum) {
    const excludeIds = orderedProducts.map((product) => product.id);

    const categoryPicks = await fetchProductsFromEachCategory(
      excludeIds,
      PRODUCTS_PER_CATEGORY,
    );

    orderedProducts = [...orderedProducts, ...categoryPicks];
  }

  /* ------------------------------------------------------------------ */
  /* 4) If still short, fall back to the newest sellable products        */
  /* ------------------------------------------------------------------ */
  if (orderedProducts.length < minimum) {
    const needed = minimum - orderedProducts.length;
    const excludeIds = orderedProducts.map((product) => product.id);

    const fallback = await prisma.product.findMany({
      where: excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {},
      select: productSelect,
      orderBy: { createdAt: "desc" },
      take: needed * 3,
    });

    orderedProducts = [
      ...orderedProducts,
      ...fallback.filter(isSellable).slice(0, needed),
    ];
  }

  return orderedProducts.slice(0, limit);
};

export const getTopSellingProducts = async (
  limit = 8,
  minimum = MIN_TOP_SELLING_PRODUCTS,
) =>
  unstable_cache(
    () => fetchTopSellingProducts(limit, minimum),
    // v6: bumped so a fresh cache entry is created.
    ["home-top-selling-v6", String(limit), String(minimum)],
    { revalidate: 300, tags: ["home-top-selling"] },
  )();
