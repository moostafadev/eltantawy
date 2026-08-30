import { Skeleton } from "@/components/skeleton";

const AdminDashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Skeleton width={180} height={32} />
        <Skeleton width={300} height={20} />
      </div>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="border border-background-second/20 bg-background p-3 shadow-sm lg:p-4"
          >
            <div className="flex items-start justify-between gap-3 lg:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Skeleton width={90} height={18} />
                <Skeleton width={70} height={36} />
                <Skeleton width={120} height={14} />
              </div>

              <Skeleton width={48} height={48} />
            </div>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {/* Overview */}
        <section className="flex min-h-55 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:col-span-2 lg:gap-4 lg:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 lg:gap-4 lg:pb-4">
            <div className="flex flex-col gap-1">
              <Skeleton width={120} height={20} />
              <Skeleton width={220} height={14} />
            </div>

            <Skeleton width={40} height={40} />
          </div>

          <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3 lg:gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-muted p-2 lg:p-3">
                <div className="flex items-center gap-3">
                  <Skeleton width={36} height={36} />

                  <div className="flex flex-1 flex-col gap-1">
                    <Skeleton width={70} height={12} />
                    <Skeleton width={50} height={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex min-h-55 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
          <div className="border-b border-border pb-3 lg:pb-4">
            <Skeleton width={120} height={20} />
            <Skeleton className="mt-1" width={220} height={14} />
          </div>

          <div className="flex flex-1 flex-col gap-2 lg:gap-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-1 items-center gap-3 border border-border p-3"
              >
                <Skeleton width={40} height={40} />

                <div className="flex flex-1 flex-col gap-1">
                  <Skeleton width={100} height={16} />
                  <Skeleton width={180} height={12} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Welcome */}
      <section className="relative min-h-32.5 overflow-hidden border border-main/20 bg-main/5 p-3 lg:p-4">
        <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 lg:gap-1.5">
            <Skeleton width={120} height={18} />
            <Skeleton width={280} height={24} />
            <Skeleton width={400} height={16} />
          </div>

          <Skeleton width={130} height={40} />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardSkeleton;
