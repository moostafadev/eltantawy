import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/button";
import { Table } from "@/components/table";
import { ProductsTable } from "@/features/admin/products/table";
import { productsTableColumns } from "@/features/admin/products/table/ProductsTableColumns";

const Products = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">المنتجات</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            إدارة منتجات المتجر
          </p>
        </div>

        <Link href="/admin/products/create" className="mr-auto self-end">
          <Button color="SUCCESS" size="sm" variant="soft">
            <Plus className="size-4" />
            <span>إنشاء منتج</span>
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <Table
            data={[]}
            columns={productsTableColumns}
            loading
            loadingRows={8}
          />
        }
      >
        <ProductsTable />
      </Suspense>
    </div>
  );
};

export default Products;
