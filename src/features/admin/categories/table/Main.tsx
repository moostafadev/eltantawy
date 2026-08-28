import { Table } from "@/components/table";
import { getCategories } from "./categories.service";
import { categoriesTableColumns } from "./CategoriesTableColumns";

const CategoriesTable = async () => {
  const categories = await getCategories();

  return (
    <Table
      data={categories}
      columns={categoriesTableColumns}
      emptyMessage="لا يوجد تصنيفات"
    />
  );
};

export default CategoriesTable;
