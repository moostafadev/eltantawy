import { AdminFormPageLoading } from "@/features/admin/InternalLoading";

const CreateDiscountLoading = () => (
  <AdminFormPageLoading
    kind="discount"
    breadcrumbCount={3}
    outerCard
  />
);

export default CreateDiscountLoading;
