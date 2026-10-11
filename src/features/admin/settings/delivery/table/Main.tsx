import { Table } from "@/components/table";
import { getDeliveryZones } from "./deliveryZones.service";
import { deliveryZonesTableColumns } from "./DeliveryZonesTableColumns";

const DeliveryZonesTable = async ({
  page,
  sort,
  direction,
}: {
  page: number;
  sort?: string;
  direction?: string;
}) => {
  const { data, pagination, sorting } = await getDeliveryZones(
    page,
    sort,
    direction,
  );

  return (
    <Table
      data={data}
      columns={deliveryZonesTableColumns}
      emptyMessage="لا يوجد مناطق توصيل"
      pagination={{ ...pagination, basePath: "/admin/settings/delivery" }}
      sorting={sorting}
    />
  );
};

export default DeliveryZonesTable;
