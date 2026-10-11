import { Table } from "@/components/table";

import { getDiscounts } from "./discounts.service";
import { discountsTableColumns } from "./DiscountsTableColumns";

const DiscountsTable = async ({
  page,
  sort,
  direction,
}: {
  page: number;
  sort?: string;
  direction?: string;
}) => {
  const { data, pagination, sorting } = await getDiscounts(
    page,
    sort,
    direction,
  );

  return (
    <Table
      data={data}
      columns={discountsTableColumns}
      emptyMessage="لا يوجد خصومات"
      pagination={{ ...pagination, basePath: "/admin/settings/discounts" }}
      sorting={sorting}
    />
  );
};

export default DiscountsTable;
