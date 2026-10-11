import { Skeleton } from "@/components/skeleton";

import ProfileSkeleton from "./ProfileSkeleton";

const RecentOrdersLoading = () => (
  <section className="overflow-hidden border border-background-second/60 bg-background shadow-sm">
    <div className="flex items-center gap-2 border-b border-background-second/60 p-3 lg:p-4">
      <Skeleton width={36} height={36} color="MAIN" />
      <div className="flex flex-col gap-1">
        <Skeleton width={80} height={16} />
        <Skeleton width={160} height={12} />
      </div>
    </div>
    {Array.from({ length: 2 }).map((_, index) => (
      <div
        key={index}
        className="flex items-center justify-between gap-3 border-b border-background-second/60 p-3 last:border-b-0 lg:p-4"
      >
        <div className="flex flex-col gap-1">
          <Skeleton width={70} height={16} />
          <Skeleton width={120} height={12} />
        </div>
        <Skeleton width={90} height={24} />
      </div>
    ))}
  </section>
);

const ProfileLoading = () => (
  <main
    role="status"
    aria-label="جاري تحميل الصفحة"
    className="flex flex-1 items-stretch bg-background-second/20 py-6 lg:py-8"
  >
    <div className="container">
      <div className="flex w-full flex-col gap-5 lg:gap-6">
        <header className="flex items-center gap-3">
          <Skeleton width={48} height={48} />
          <div className="flex flex-col gap-1.5">
            <Skeleton width={190} height={32} className="max-w-full" />
            <Skeleton width={260} height={16} className="max-w-full" />
          </div>
        </header>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-5">
          <div className="flex min-w-0 flex-col gap-4">
            <ProfileSkeleton />
            <RecentOrdersLoading />
          </div>

          <aside className="flex flex-col gap-3 border border-background-second/60 bg-background p-3 shadow-sm lg:p-4">
            <div className="border-b border-background-second/60 pb-3">
              <Skeleton width={120} height={20} />
              <Skeleton width={180} height={14} className="mt-1 max-w-full" />
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border border-background-second/60 p-3"
              >
                <Skeleton width={40} height={40} className="shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Skeleton width={110} height={16} />
                  <Skeleton width={150} height={12} className="max-w-full" />
                </div>
                <Skeleton width={16} height={16} className="shrink-0" />
              </div>
            ))}
            <div className="border-t border-background-second/60 pt-3">
              <Skeleton height={40} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  </main>
);

export default ProfileLoading;
