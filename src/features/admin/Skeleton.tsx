import { Skeleton } from "@/components/skeleton";

import { COLOR } from "@/constants/types";
import PageViewsTable from "./page-views/PageViewsTable";

const financialColors: COLOR[] = ["SUCCESS", "INFO", "MAIN", "DANGER"];

const featuredColors: COLOR[] = ["INFO", "SUCCESS", "DANGER"];

const secondaryColors: COLOR[] = ["WARNING", "MAIN"];

const tableColors: COLOR[] = [
  "INFO",
  "SUCCESS",
  "WARNING",
  "MAIN",
  "DANGER",
  "SECONDARY",
];

const AdminDashboardSkeleton = () => {
  return (
    <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <Skeleton width={180} height={32} className="max-w-full" />
        <Skeleton width={300} height={20} className="max-w-full" />
      </div>

      {/* Financial Performance */}
      <section className="flex min-w-0 flex-col gap-3 lg:gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Skeleton width={36} height={36} color="SUCCESS" />
            <div className="flex flex-col gap-1">
              <Skeleton width={110} height={24} />
              <Skeleton width={150} height={16} />
            </div>
          </div>

          <Skeleton width={140} height={14} className="max-w-full" />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {financialColors.map((color, index) => (
            <div
              key={index}
              className="relative min-w-0 overflow-hidden border border-background-second/20 bg-background p-3 shadow-sm lg:p-5"
            >
              <Skeleton
                height={4}
                color={color}
                className="absolute inset-x-0 top-0"
              />

              <div className="flex items-start justify-between gap-3 lg:gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Skeleton width={100} height={20} />
                  <Skeleton width={90} height={32} />
                  <Skeleton width={140} height={16} className="max-w-full" />
                </div>

                <Skeleton width={48} height={48} color={color} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Stats */}
      <section className="flex min-w-0 flex-col gap-3 lg:gap-4">
        <div className="flex items-center gap-2.5">
          <Skeleton width={36} height={36} color="INFO" />
          <div className="flex flex-col gap-1">
            <Skeleton width={110} height={24} />
            <Skeleton width={240} height={16} className="max-w-full" />
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
          {featuredColors.map((color, index) => (
            <div
              key={index}
              className="relative min-w-0 overflow-hidden border border-background-second/20 bg-background p-3 shadow-sm lg:p-5"
            >
              <Skeleton
                height={4}
                color={color}
                className="absolute inset-x-0 top-0"
              />

              <div className="flex items-start justify-between gap-3 lg:gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Skeleton width={90} height={20} />
                  <Skeleton width={80} height={44} />
                  <Skeleton width={120} height={16} />
                </div>

                <Skeleton
                  width={52}
                  height={52}
                  color={color}
                  className="shrink-0"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Page Views */}
      <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2 gap-y-1.5 border-b border-border pb-3 sm:flex sm:items-center sm:gap-2.5 lg:pb-4">
          <Skeleton
            width={32}
            height={32}
            color="INFO"
            className="row-span-2 sm:hidden"
          />
          <Skeleton
            width={36}
            height={36}
            color="INFO"
            className="hidden shrink-0 sm:block"
          />
          <div className="col-start-2 row-start-1 min-w-0 sm:flex-1">
            <Skeleton
              width={150}
              height={18}
              className="max-w-full sm:hidden"
            />
            <Skeleton
              width={150}
              height={24}
              className="hidden max-w-full sm:block"
            />
            <div className="mt-1 flex flex-col gap-1 sm:hidden">
              <Skeleton width={220} height={12} className="max-w-full" />
              <Skeleton width={174} height={12} className="max-w-full" />
            </div>
            <Skeleton
              width={360}
              height={20}
              className="mt-1 hidden max-w-full sm:block"
            />
          </div>
          <Skeleton
            width={105}
            height={14}
            className="col-start-2 row-start-2 mr-auto max-w-full sm:col-auto sm:row-auto sm:mr-0"
          />
        </div>

        <PageViewsTable data={[]} loading />
      </section>

      {/* Tables Shortcuts */}
      <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
        <div className="border-b border-border pb-3 lg:pb-4">
          <Skeleton width={90} height={24} />
          <Skeleton className="mt-1" width={230} height={20} />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
          {tableColors.map((color, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 border border-border p-3 text-center"
            >
              <Skeleton width={40} height={40} color={color} />

              <div className="flex w-full flex-col items-center gap-1">
                <Skeleton width={70} height={20} />
                <Skeleton width={50} height={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        {/* Overview */}
        <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:col-span-2 lg:gap-4 lg:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 lg:gap-4 lg:pb-4">
            <div className="flex flex-col gap-1">
              <Skeleton width={120} height={24} />
              <Skeleton width={220} height={20} />
            </div>

            <Skeleton width={40} height={40} color="MAIN" />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-3">
            {secondaryColors.map((color, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-muted p-2 lg:p-3"
              >
                <Skeleton width={36} height={36} color={color} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Skeleton width={70} height={16} />
                  <Skeleton width={50} height={24} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex min-w-0 flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
          <div className="border-b border-border pb-3 lg:pb-4">
            <Skeleton width={120} height={24} />
            <Skeleton className="mt-1" width={220} height={20} />
          </div>

          <div className="flex flex-col gap-2 lg:gap-3">
            {(["SUCCESS", "WARNING", "MAIN", "DANGER"] as COLOR[]).map(
              (color, index) => (
                <div
                  key={index}
                  className="flex min-w-0 items-center gap-3 border border-border p-3"
                >
                  <Skeleton width={40} height={40} color={color} />

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Skeleton width={100} height={20} />
                    <Skeleton width={180} height={16} />
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </div>

      {/* Welcome */}
      <section className="relative overflow-hidden border border-main/20 bg-main/5 p-3 lg:p-4">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-4">
          <div className="flex min-w-0 flex-col gap-1 lg:gap-1.5">
            <div className="mb-1 flex items-center gap-2 lg:mb-2">
              <Skeleton width={20} height={20} color="MAIN" />
              <Skeleton width={100} height={20} />
            </div>
            <Skeleton width={280} height={28} />
            <Skeleton width={400} height={20} className="max-w-full" />
          </div>

          <Skeleton width={130} height={40} className="self-end sm:self-auto" />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardSkeleton;
