import { Skeleton } from "@/components/skeleton";

const PageViewsSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Skeleton width={220} height={32} />
      <Skeleton width={320} height={18} />
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((item) => (
        <Skeleton key={item} height={112} />
      ))}
    </div>
    <Skeleton height={210} />
    <Skeleton height={240} />
    <Skeleton height={320} />
  </div>
);

export default PageViewsSkeleton;
