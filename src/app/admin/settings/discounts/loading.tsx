import { Table } from "@/components/table";
import { discountsTableColumns } from "@/features/admin/settings/discounts/table/DiscountsTableColumns";
import { AdminListPageLoading } from "@/features/admin/Loading";

const DiscountsLoading = () => (
  <AdminListPageLoading
    breadcrumb
    action
    titleWidth={90}
    descriptionWidth={280}
  >
    <Table
      data={[]}
      columns={discountsTableColumns}
      loading
      loadingRows={8}
    />
  </AdminListPageLoading>
);

export default DiscountsLoading;
