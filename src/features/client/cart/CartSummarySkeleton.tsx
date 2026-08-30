import { Skeleton } from "@/components/skeleton";

const CartSummarySkeleton = () => {
  return (
    <aside className="flex h-fit flex-col gap-3 border border-border bg-background p-3 lg:gap-4 lg:p-4">
      <Skeleton width={110} height={22} color="NEUTRAL" />

      <div className="flex flex-col gap-3 text-sm lg:gap-4">
        <div className="flex items-center justify-between gap-4">
          <Skeleton width={95} height={14} color="NEUTRAL" />

          <Skeleton width={75} height={16} color="NEUTRAL" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Skeleton width={70} height={14} color="NEUTRAL" />

          <Skeleton width={65} height={16} color="SUCCESS" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Skeleton width={85} height={14} color="NEUTRAL" />

          <Skeleton width={70} height={16} color="NEUTRAL" />
        </div>

        <div className="border-t border-border pt-3 lg:pt-4">
          <div className="flex items-center justify-between gap-4">
            <Skeleton width={55} height={17} color="NEUTRAL" />

            <Skeleton width={100} height={25} color="MAIN" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:gap-3">
        <Skeleton height={40} color="MAIN" className="w-full" />

        <Skeleton height={40} color="NEUTRAL" className="w-full" />
      </div>
    </aside>
  );
};

export default CartSummarySkeleton;
