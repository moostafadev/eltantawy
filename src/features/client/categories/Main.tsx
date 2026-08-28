import { FolderTree } from "lucide-react";

import { Card } from "@/components/card";

import CategoryTree from "./CategoryTree";
import type { getCategoriesForStore } from "./category.service";

interface CategoriesProps {
  categories: Awaited<ReturnType<typeof getCategoriesForStore>>;
}

const Categories = ({ categories }: CategoriesProps) => {
  return (
    <main className="container py-6 lg:py-8">
      <div className="flex flex-col gap-6 lg:gap-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center bg-main/10 text-main">
              <FolderTree className="size-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold lg:text-2xl">التصنيفات</h1>

              <p className="text-sm text-muted-foreground">
                تصفح التصنيفات والمنتجات بسهولة
              </p>
            </div>
          </div>
        </header>

        {categories.length > 0 ? (
          <CategoryTree categories={categories} />
        ) : (
          <Card className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
            لا توجد تصنيفات متاحة حاليًا
          </Card>
        )}
      </div>
    </main>
  );
};

export default Categories;
