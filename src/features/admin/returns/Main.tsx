import { Table } from "@/components/table";
import { getReturns } from "./returns.service";
import { returnsTableColumns } from "./ReturnsTableColumns";

const ReturnsTable = async () => {
  const returns = await getReturns();

  return (
    <Table
      data={returns}
      columns={returnsTableColumns}
      emptyMessage="لا يوجد مرتجعات"
    />
  );
};

export default ReturnsTable;
