import { Table } from "@/components/table";
import { getCategories } from "./categories.service";
import { categoriesTableColumns } from "./CategoriesTableColumns";

const CategoriesTable = async ({
  page,
  sort,
  direction,
}: {
  page: number;
  sort?: string;
  direction?: string;
}) => {
  const { data, pagination, sorting } = await getCategories(
    page,
    sort,
    direction,
  );

  return (
    <Table
      data={data}
      columns={categoriesTableColumns}
      emptyMessage="لا يوجد تصنيفات"
      pagination={{ ...pagination, basePath: "/admin/products/categories" }}
      sorting={sorting}
    />
  );
};

export default CategoriesTable;
