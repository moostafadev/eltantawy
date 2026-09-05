import { Skeleton } from "@/components/skeleton";
import { COLOR } from "@/constants/types";

const statColors: COLOR[] = ["SUCCESS", "INFO", "MAIN", "DANGER"];

const SalesSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex flex-col gap-1">
        <Skeleton width={140} height={32} />
        <Skeleton width={280} height={20} />
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {statColors.map((color, index) => (
          <div
            key={index}
            className="relative overflow-hidden border border-background-second/20 bg-background p-3 shadow-sm lg:p-5"
          >
            <Skeleton
              height={4}
              color={color}
              className="absolute inset-x-0 top-0"
            />

            <div className="flex items-start justify-between gap-3 lg:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Skeleton width={100} height={16} />
                <Skeleton width={90} height={32} />
                <Skeleton width={140} height={12} />
              </div>

              <Skeleton width={48} height={48} color={color} />
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        <section className="flex min-h-64 flex-col gap-4 border border-background-second/20 bg-background p-3 shadow-sm lg:col-span-2 lg:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 lg:pb-4">
            <div className="flex flex-col gap-1">
              <Skeleton width={130} height={20} />
              <Skeleton width={200} height={14} />
            </div>

            <Skeleton width={40} height={40} color="SUCCESS" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 lg:gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border border-background-second/20 bg-background p-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <Skeleton width={30} height={12} />
                  <Skeleton width={24} height={24} />
                </div>

                <Skeleton width={60} height={22} />
                <Skeleton width={40} height={12} />
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-64 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 lg:pb-4">
            <div className="flex flex-col gap-1">
              <Skeleton width={110} height={20} />
              <Skeleton width={140} height={14} />
            </div>

            <Skeleton width={40} height={40} color="DANGER" />
          </div>

          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} height={38} />
            ))}
          </div>
        </section>
      </div>

      <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <Skeleton width={150} height={20} />
          <Skeleton className="mt-1" width={260} height={14} />
        </div>

        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={36} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <Skeleton width={110} height={20} />
          <Skeleton className="mt-1" width={260} height={14} />
        </div>

        <Skeleton height={200} />
      </section>
    </div>
  );
};

export default SalesSkeleton;
