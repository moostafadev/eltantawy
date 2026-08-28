import { Package } from "lucide-react";
import Image from "next/image";

import { Card } from "@/components/card";
import type { getCategoriesForStore } from "./category.service";

interface CategoryProductsProps {
  category: Awaited<ReturnType<typeof getCategoriesForStore>>[number];
}

const CategoryProducts = ({ category }: CategoryProductsProps) => {
  if (category.products.length === 0) {
    return (
      <Card className="flex min-h-32 flex-col items-center justify-center gap-2 text-center shadow-none">
        <Package className="size-7 text-muted-foreground" />

        <p className="text-sm font-medium">لا توجد منتجات في هذا التصنيف</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {category.children.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {category.children.map((child) => (
            <Card key={child.id} className="px-3 py-1.5 text-xs shadow-none">
              <span>{child.title}</span>

              <span className="mr-1 text-muted-foreground">
                ({child.productsCount})
              </span>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {category.products.map((product) => {
          const hasDiscount =
            product.discountPrice !== null &&
            product.discountPrice < product.price;

          const price = hasDiscount ? product.discountPrice : product.price;

          return (
            <Card
              key={product.id}
              className="group overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-main/30 hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <Package className="size-8" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 p-3">
                <h3 className="line-clamp-1 text-sm font-semibold">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-main">{price}</span>

                    {hasDiscount && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        {product.price}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-muted-foreground">
                    {product.unit === "KG" ? "كجم" : "قطعة"}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {category.productsCount > category.products.length && (
        <p className="text-center text-xs text-muted-foreground">
          يتم عرض {category.products.length} من أصل {category.productsCount}{" "}
          منتج
        </p>
      )}
    </div>
  );
};

export default CategoryProducts;
