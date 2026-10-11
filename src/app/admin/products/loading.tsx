import { Table } from "@/components/table";
import { productsTableColumns } from "@/features/admin/products/table/ProductsTableColumns";
import { AdminListPageLoading } from "@/features/admin/Loading";

const ProductsLoading = () => (
  <AdminListPageLoading action titleWidth={110} descriptionWidth={160}>
    <Table data={[]} columns={productsTableColumns} loading loadingRows={8} />
  </AdminListPageLoading>
);

export default ProductsLoading;
