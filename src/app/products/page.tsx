import { LayoutGrid, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/features/client/product-card";
import { ProductsGridSkeleton } from "@/features/client/products";
import { buildMetadata } from "@/lib/seo/metadata";
import { toArabicNums } from "@/utils/toArabicNums";

const PRODUCTS_PER_PAGE = 24;

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string | string[];
    category?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const getPageNumber = (page?: string | string[]) => {
  const value = getSingleValue(page);
  const parsed = Number(value);

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
};

const isValidObjectId = (id?: string): id is string =>
  typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

const buildProductsHref = (target: { page?: number; category?: string }) => {
  const search = new URLSearchParams();

  if (target.page && target.page > 1) {
    search.set("page", String(target.page));
  }

  if (target.category) {
    search.set("category", target.category);
  }

  const query = search.toString();

  return query ? `/products?${query}` : "/products";
};

export const generateMetadata = async ({
  searchParams,
}: ProductsPageProps): Promise<Metadata> => {
  const params = await searchParams;
  const page = getPageNumber(params.page);

  return buildMetadata({
    title: page > 1 ? `المنتجات - الصفحة ${page}` : "المنتجات",
    description:
      "تصفح منتجات الطنطاوي من اللحوم والدواجن الطازجة بأسعار مناسبة وجودة عالية، مع خيارات بيع بالكيلو أو بالقطعة.",
    path: page > 1 ? `/products?page=${page}` : "/products",
    keywords: ["منتجات لحوم", "شراء لحوم اونلاين", "أسعار اللحوم"],
  });
};

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const params = await searchParams;
  const page = getPageNumber(params.page);
  const categoryId = getSingleValue(params.category);

  /*
   * Leaf categories that directly contain at least one product.
   * `products: { some: {} }` excludes parent categories that only hold
   * subcategories.
   */
  const categories = await prisma.category.findMany({
    where: {
      products: { some: {} },
    },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <main className="container py-6 lg:py-8">
      <div className="flex flex-col gap-6 lg:gap-8">
        {/* Header */}
        <header className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center bg-main/10 text-main">
            <Package className="size-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            جميع المنتجات
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground lg:text-base">
            تصفّح اللحوم والدواجن المتاحة، واطّلع على السعر والوحدة قبل الإضافة
            إلى سلتك.
          </p>
        </header>

        {/* Category Filter (stays visible during navigation) */}
        {categories.length > 0 && (
          <CategoryFilterSection
            categories={categories}
            activeCategoryId={categoryId}
          />
        )}

        {/*
         * Keyed Suspense: when `categoryId` or `page` changes, the boundary
         * is remounted and shows `ProductsGridSkeleton` while the new data
         * is being fetched on the server.
         */}
        <Suspense
          key={`${categoryId ?? "all"}-${page}`}
          fallback={<ProductsGridSkeleton />}
        >
          <ProductsContent categoryId={categoryId} page={page} />
        </Suspense>
      </div>
    </main>
  );
};

/* ------------------------------------------------------------------ */
/* Category Filter                                                     */
/* ------------------------------------------------------------------ */

interface CategoryFilterSectionProps {
  categories: {
    id: string;
    title: string;
    _count: { products: number };
  }[];
  activeCategoryId?: string;
}

const CategoryFilterSection = ({
  categories,
  activeCategoryId,
}: CategoryFilterSectionProps) => {
  return (
    <section
      aria-label="تصفية حسب التصنيف"
      className="flex flex-col gap-3 border-y border-background-second/60 py-4"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <LayoutGrid aria-hidden="true" className="size-3.5" />
        <span>تصفية حسب التصنيف</span>
      </div>

      <div className="scrollbar-hide -mx-4 overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:px-0">
        <div className="flex w-max min-w-full items-center gap-2 sm:w-auto sm:flex-wrap">
          <FilterPill
            href={buildProductsHref({})}
            active={!activeCategoryId}
            label="الكل"
          />

          {categories.map((category) => (
            <FilterPill
              key={category.id}
              href={buildProductsHref({ category: category.id })}
              active={activeCategoryId === category.id}
              label={category.title}
              count={category._count.products}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FilterPillProps {
  href: string;
  active: boolean;
  label: string;
  count?: number;
}

/**
 * Square filter chip — no rounded corners, matching the rest of the
 * site's design language (border + flat background).
 */
const FilterPill = ({ href, active, label, count }: FilterPillProps) => {
  return (
    <Link
      href={href}
      prefetch={false}
      aria-current={active ? "page" : undefined}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
        active
          ? "border-main bg-main text-main-foreground"
          : "border-border bg-background text-foreground hover:border-main/40 hover:bg-main/5 hover:text-main"
      }`}
    >
      <span>{label}</span>

      {count !== undefined && (
        <span
          className={`text-[10px] font-bold tabular-nums ${
            active ? "text-main-foreground/80" : "text-muted-foreground"
          }`}
        >
          {toArabicNums(count)}
        </span>
      )}
    </Link>
  );
};

/* ------------------------------------------------------------------ */
/* Products + Pagination                                               */
/* ------------------------------------------------------------------ */

interface ProductsContentProps {
  categoryId?: string;
  page: number;
}

const ProductsContent = async ({ categoryId, page }: ProductsContentProps) => {
  const activeCategory = isValidObjectId(categoryId)
    ? await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true, title: true },
      })
    : null;

  const where = activeCategory ? { categoryId: activeCategory.id } : {};

  const [productsCount, products] = await Promise.all([
    prisma.product.count({ where }),

    prisma.product.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
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
    }),
  ]);

  const totalPages = Math.ceil(productsCount / PRODUCTS_PER_PAGE);

  if (page > Math.max(totalPages, 1)) {
    notFound();
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center border border-border bg-background p-6 text-center">
        <div className="flex size-12 items-center justify-center bg-muted text-muted-foreground">
          <Package className="size-6" />
        </div>

        <h2 className="mt-4 font-bold">لا توجد منتجات</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {activeCategory
            ? `لا توجد منتجات في تصنيف "${activeCategory.title}" حاليًا.`
            : "لا توجد منتجات متاحة حاليًا."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="صفحات المنتجات"
          className="flex items-center justify-center gap-4"
        >
          {page > 1 ? (
            <Link
              href={buildProductsHref({
                page: page - 1,
                category: activeCategory?.id,
              })}
              prefetch={false}
              rel="prev"
              className="border border-background-second/60 px-4 py-2 text-sm font-medium transition-colors hover:border-main hover:text-main"
            >
              السابق
            </Link>
          ) : (
            <span className="border border-background-second/40 px-4 py-2 text-sm text-muted-foreground">
              السابق
            </span>
          )}

          <span className="text-sm text-muted-foreground">
            صفحة {toArabicNums(page)} من {toArabicNums(totalPages)}
          </span>

          {page < totalPages ? (
            <Link
              href={buildProductsHref({
                page: page + 1,
                category: activeCategory?.id,
              })}
              prefetch={false}
              rel="next"
              className="border border-background-second/60 px-4 py-2 text-sm font-medium transition-colors hover:border-main hover:text-main"
            >
              التالي
            </Link>
          ) : (
            <span className="border border-background-second/40 px-4 py-2 text-sm text-muted-foreground">
              التالي
            </span>
          )}
        </nav>
      )}
    </div>
  );
};

export default ProductsPage;
