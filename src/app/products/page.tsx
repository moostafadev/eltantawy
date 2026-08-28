import { Package } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/features/client/product-card";

const ProductsPage = async () => {
  const products = await prisma.product.findMany({
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
            اكتشف جميع منتجاتنا واختر ما يناسبك من أفضل المنتجات المتوفرة
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
      </div>
    </main>
  );
};

export default ProductsPage;
