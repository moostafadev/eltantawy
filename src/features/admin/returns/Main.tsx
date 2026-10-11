import { Table } from "@/components/table";
import { getReturns } from "./returns.service";
import { returnsTableColumns } from "./ReturnsTableColumns";

const ReturnsTable = async ({
  page,
  sort,
  direction,
}: {
  page: number;
  sort?: string;
  direction?: string;
}) => {
  const { data, pagination, sorting } = await getReturns(
    page,
    sort,
    direction,
  );

  return (
    <Table
      data={data}
      columns={returnsTableColumns}
      emptyMessage="لا يوجد مرتجعات"
      pagination={{ ...pagination, basePath: "/admin/returns" }}
      sorting={sorting}
    />
  );
};

export default ReturnsTable;
