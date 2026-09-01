import { FolderTree, LayoutGrid } from "lucide-react";

import { Card } from "@/components/card";

import type { getCategoriesForStore } from "./category.service";
import CategoriesQuickNav from "./CategoriesQuickNav";
import CategorySection from "./CategorySection";

interface CategoriesProps {
  categories: Awaited<ReturnType<typeof getCategoriesForStore>>;
}

const Categories = ({ categories }: CategoriesProps) => {
  const visibleCategories = categories.filter(
    (category) => category.totalProductsCount > 0,
  );

  const totalCategories = visibleCategories.length;

  const totalProducts = visibleCategories.reduce(
    (sum, category) => sum + category.totalProductsCount,
    0,
  );

  return (
    <main className="flex flex-col">
      <div className="container py-6 lg:py-8">
        <div className="flex flex-col gap-6 lg:gap-8">
          <header className="flex flex-col gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center bg-main/10 text-main lg:size-12">
                <FolderTree className="size-5 lg:size-6" strokeWidth={1.75} />
              </div>

              <div>
                <h1 className="text-xl font-bold lg:text-2xl">التصنيفات</h1>

                <p className="text-sm text-muted-foreground">
                  كل المنتجات في مكان واحد، مقسّمة عليك تلاقيها بسهولة
                </p>
              </div>
            </div>

            {totalCategories > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <LayoutGrid className="size-3.5" />
                  {totalCategories} تصنيف
                </span>

                <span className="inline-flex items-center gap-1.5 bg-main/10 px-3 py-1.5 text-xs font-medium text-main">
                  <FolderTree className="size-3.5" />
                  {totalProducts} منتج
                </span>
              </div>
            )}
          </header>
        </div>
      </div>

      {visibleCategories.length > 0 ? (
        <>
          <CategoriesQuickNav categories={visibleCategories} />

          <div className="container flex flex-col gap-10 py-8 lg:gap-14 lg:py-10">
            {visibleCategories.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </div>
        </>
      ) : (
        <div className="container pb-10">
          <Card className="flex min-h-64 flex-col items-center justify-center gap-3 text-center shadow-none">
            <div className="flex size-14 items-center justify-center bg-muted text-muted-foreground">
              <FolderTree className="size-6" />
            </div>

            <p className="text-sm font-medium">لا توجد تصنيفات متاحة حاليًا</p>
          </Card>
        </div>
      )}
    </main>
  );
};

export default Categories;
