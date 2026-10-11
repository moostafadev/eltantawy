import { Skeleton } from "@/components/skeleton";
import { COLOR } from "@/constants/types";

import MonthlyViewsTable from "./MonthlyViewsTable";
import PageViewsTable from "./PageViewsTable";

const statColors: COLOR[] = ["INFO", "SUCCESS", "MAIN", "WARNING"];

const SectionHeadingSkeleton = () => (
  <div className="border-b border-border pb-3 lg:pb-4">
    <Skeleton width={180} height={24} />
    <Skeleton width={260} height={20} className="mt-1 max-w-full" />
  </div>
);

const PageViewsSkeleton = () => (
  <div
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex min-w-0 flex-col gap-3 lg:gap-4"
  >
    <div className="flex min-w-0 flex-col gap-1">
      <Skeleton width={240} height={32} className="max-w-full" />
      <Skeleton width={340} height={20} className="max-w-full" />
    </div>

    <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {statColors.map((color) => (
        <div
          key={color}
          className="relative min-w-0 overflow-hidden border border-background-second/20 bg-background p-3 shadow-sm lg:p-5"
        >
          <Skeleton
            height={4}
            color={color}
            className="absolute inset-x-0 top-0"
          />
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Skeleton width={130} height={20} className="max-w-full" />
              <Skeleton width={90} height={36} className="max-w-full" />
              <Skeleton width={150} height={16} className="max-w-full" />
            </div>
            <Skeleton width={48} height={48} color={color} className="shrink-0" />
          </div>
        </div>
      ))}
    </section>

    <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
      <SectionHeadingSkeleton />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex min-w-0 flex-col gap-2 border border-background-second/20 bg-background p-3 shadow-sm"
          >
            <Skeleton width={72} height={16} className="max-w-full" />
            <Skeleton width={64} height={28} className="max-w-full" />
            <Skeleton width={44} height={16} className="max-w-full" />
          </div>
        ))}
      </div>
    </section>

    <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
      <SectionHeadingSkeleton />
      <MonthlyViewsTable data={[]} loading />
    </section>

    <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
      <div className="min-w-0 border-b border-border pb-2.5 sm:pb-3 lg:pb-4">
        <Skeleton width={132} height={18} className="max-w-full" />
        <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center">
          <Skeleton width={150} height={14} className="max-w-full" />
          <Skeleton width={220} height={14} className="max-w-full" />
        </div>
      </div>
      <PageViewsTable data={[]} loading />
    </section>
  </div>
);

export default PageViewsSkeleton;
