import { Suspense } from "react";

import { parsePage } from "@/components/table";
import { PageViews, PageViewsSkeleton } from "@/features/admin/page-views";

const PageViewsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; direction?: string }>;
}) => {
  const params = await searchParams;
  const page = parsePage(params.page);

  return (
    <Suspense fallback={<PageViewsSkeleton />}>
      <PageViews
        page={page}
        sort={params.sort}
        direction={params.direction}
      />
    </Suspense>
  );
};

export default PageViewsPage;
