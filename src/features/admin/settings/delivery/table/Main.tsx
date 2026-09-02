import { Table } from "@/components/table";
import { getDeliveryZones } from "./deliveryZones.service";
import { deliveryZonesTableColumns } from "./DeliveryZonesTableColumns";

const DeliveryZonesTable = async () => {
  const deliveryZones = await getDeliveryZones();

  return (
    <Table
      data={deliveryZones}
      columns={deliveryZonesTableColumns}
      emptyMessage="لا يوجد مناطق توصيل"
    />
  );
};

export default DeliveryZonesTable;
