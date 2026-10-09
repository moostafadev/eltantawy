import { Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/features/client/product-card";
import { buildMetadata } from "@/lib/seo/metadata";
import { toArabicNums } from "@/utils/toArabicNums";

const PRODUCTS_PER_PAGE = 24;

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string | string[];
  }>;
}

const getPageNumber = (page?: string | string[]) => {
  const value = Array.isArray(page) ? page[0] : page;
  const parsed = Number(value);

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
};

export const generateMetadata = async ({
  searchParams,
}: ProductsPageProps): Promise<Metadata> => {
  const page = getPageNumber((await searchParams).page);

  return buildMetadata({
    title: page > 1 ? `المنتجات - الصفحة ${page}` : "المنتجات",
    description:
      "تصفح منتجات الطنطاوي من اللحوم والدواجن الطازجة بأسعار مناسبة وجودة عالية، مع خيارات بيع بالكيلو أو بالقطعة.",
    path: page > 1 ? `/products?page=${page}` : "/products",
    keywords: ["منتجات لحوم", "شراء لحوم اونلاين", "أسعار اللحوم"],
  });
};

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const page = getPageNumber((await searchParams).page);

  const [productsCount, products] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({
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
            تصفّح اللحوم والدواجن المتاحة، واطّلع على السعر والوحدة قبل الإضافة إلى سلتك.
          </p>
        </header>

        {/* Products */}
        {products.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center border border-border bg-background p-6 text-center">
            <div className="flex size-12 items-center justify-center bg-muted text-muted-foreground">
              <Package className="size-6" />
            </div>

            <h2 className="mt-4 font-bold">لا توجد منتجات</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              لا توجد منتجات متاحة حاليًا.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="صفحات المنتجات"
            className="flex items-center justify-center gap-4"
          >
            {page > 1 ? (
              <Link
                href={`/products?page=${page - 1}`}
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
                href={`/products?page=${page + 1}`}
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
    </main>
  );
};

export default ProductsPage;
