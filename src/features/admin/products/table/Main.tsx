import { Table } from "@/components/table";
import { getProducts } from "./products.service";
import { productsTableColumns } from "./ProductsTableColumns";

const ProductsTable = async ({
  page,
  sort,
  direction,
}: {
  page: number;
  sort?: string;
  direction?: string;
}) => {
  const { data, pagination, sorting } = await getProducts(
    page,
    sort,
    direction,
  );

  return (
    <Table
      data={data}
      columns={productsTableColumns}
      emptyMessage="لا يوجد منتجات"
      pagination={{ ...pagination, basePath: "/admin/products" }}
      sorting={sorting}
    />
  );
};

export default ProductsTable;
