import { Table } from "@/components/table";

import { getDiscounts } from "./discounts.service";
import { discountsTableColumns } from "./DiscountsTableColumns";

const DiscountsTable = async () => {
  const discounts = await getDiscounts();

  return (
    <Table
      data={discounts}
      columns={discountsTableColumns}
      emptyMessage="لا يوجد خصومات"
    />
  );
};

export default DiscountsTable;
