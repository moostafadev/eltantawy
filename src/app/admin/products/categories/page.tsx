import Link from "next/link";

import { Button } from "@/components/button";

import {
  getCategories,
  CategoriesTable,
} from "@/features/admin/categories/table";
import Example from "@/components/dialog/test";

const CategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">التصنيفات</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            إدارة تصنيفات المنتجات
          </p>
        </div>
        <Link href="/admin/products/categories/create" className="mr-auto">
          <Button color="MAIN" size="sm">
            إنشاء تصنيف
          </Button>
        </Link>
      </div>

      <CategoriesTable categories={categories} />
      <Example />
    </div>
  );
};

export default CategoriesPage;
