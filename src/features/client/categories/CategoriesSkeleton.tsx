import { Skeleton } from "@/components/skeleton";

const CategoriesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden border border-border bg-background shadow-sm"
        >
          <Skeleton height={240} className="w-full" />

          <div className="flex flex-col gap-2 p-3 lg:p-4">
            <Skeleton height={20} width={120} />
            <Skeleton height={14} width={180} />
            <Skeleton height={14} width={140} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesSkeleton;
