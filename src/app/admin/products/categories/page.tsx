import Link from "next/link";

import { Button } from "@/components/button";

import {
  getCategories,
  CategoriesTable,
} from "@/features/admin/categories/table";
import { Plus } from "lucide-react";

const CategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">التصنيفات</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            إدارة تصنيفات المنتجات
          </p>
        </div>
        <Link href="/admin/products/categories/create" className="mr-auto">
          <Button color="SECONDARY" size="sm">
            <Plus className="size-4" />
            <span>إنشاء تصنيف</span>
          </Button>
        </Link>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  );
};

export default CategoriesPage;
