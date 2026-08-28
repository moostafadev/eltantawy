import { Table } from "@/components/table";
import { getProducts } from "./products.service";
import { productsTableColumns } from "./ProductsTableColumns";

const ProductsTable = async () => {
  const products = await getProducts();

  return (
    <Table
      data={products}
      columns={productsTableColumns}
      emptyMessage="لا يوجد منتجات"
    />
  );
};

export default ProductsTable;
