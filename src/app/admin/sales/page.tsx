import { Suspense } from "react";

import { Sales, SalesSkeleton } from "@/features/admin/sales";

const SalesPage = () => {
  return (
    <Suspense fallback={<SalesSkeleton />}>
      <Sales />
    </Suspense>
  );
};

export default SalesPage;
