import { Table } from "@/components/table";
import { categoriesTableColumns } from "@/features/admin/categories/table/CategoriesTableColumns";
import { AdminListPageLoading } from "@/features/admin/Loading";

const CategoriesLoading = () => (
  <AdminListPageLoading action titleWidth={110} descriptionWidth={190}>
    <Table data={[]} columns={categoriesTableColumns} loading loadingRows={8} />
  </AdminListPageLoading>
);

export default CategoriesLoading;
