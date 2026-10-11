import { AdminFormPageLoading } from "@/features/admin/InternalLoading";

const CreateDeliveryLoading = () => (
  <AdminFormPageLoading
    kind="delivery"
    breadcrumbCount={3}
    outerCard
  />
);

export default CreateDeliveryLoading;
