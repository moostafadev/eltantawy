import { Package } from "lucide-react";

import { Card } from "@/components/card";

import type { getCategoriesForStore } from "./category.service";
import { ProductCard } from "../product-card";

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

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
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
