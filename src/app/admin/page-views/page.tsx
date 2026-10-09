import { Suspense } from "react";

import { PageViews, PageViewsSkeleton } from "@/features/admin/page-views";

const PageViewsPage = () => (
  <Suspense fallback={<PageViewsSkeleton />}>
    <PageViews />
  </Suspense>
);

export default PageViewsPage;
