import { Table } from "@/components/table";
import { deliveryZonesTableColumns } from "@/features/admin/settings/delivery/table/DeliveryZonesTableColumns";
import { AdminListPageLoading } from "@/features/admin/Loading";

const DeliveryZonesLoading = () => (
  <AdminListPageLoading
    breadcrumb
    action
    titleWidth={160}
    descriptionWidth={250}
  >
    <Table
      data={[]}
      columns={deliveryZonesTableColumns}
      loading
      loadingRows={8}
    />
  </AdminListPageLoading>
);

export default DeliveryZonesLoading;
