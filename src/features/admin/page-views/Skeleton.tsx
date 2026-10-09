import { Skeleton } from "@/components/skeleton";

const statColors = ["INFO", "SUCCESS", "MAIN", "WARNING"] as const;

const SectionHeadingSkeleton = () => (
  <div className="flex flex-col gap-2 border-b border-border pb-3 lg:pb-4">
    <Skeleton width={180} height={18} />
    <Skeleton width={260} height={14} className="max-w-full" />
  </div>
);

const TableSkeleton = () => (
  <div className="w-full overflow-hidden border border-background-second/60 bg-background shadow-sm">
    <div className="flex flex-col gap-2 p-2 sm:hidden">
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-col gap-3 border border-background-second/30 p-3"
        >
          {[140, 190, 80].map((width, columnIndex) => (
            <div
              key={columnIndex}
              className="flex items-center justify-between gap-3"
            >
              <Skeleton width={72} height={12} />
              <Skeleton width={width} height={14} />
            </div>
          ))}
        </div>
      ))}
    </div>

    <div className="hidden w-full overflow-x-auto sm:block">
      <table className="w-full min-w-200 border-collapse">
        <thead>
          <tr className="bg-background-second/20">
            {[120, 160, 100].map((width, index) => (
              <th
                key={index}
                className="border-b border-background-second/50 px-4 py-3 text-right lg:px-5 lg:py-4"
              >
                <Skeleton width={width} height={12} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-background-second/30 last:border-b-0"
            >
              {[140, 190, 80].map((width, columnIndex) => (
                <td
                  key={columnIndex}
                  className="px-4 py-2.5 text-right lg:px-5"
                >
                  <Skeleton width={width} height={14} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex items-center justify-between border-t border-background-second/50 bg-background-second/5 px-2 py-1.5 lg:px-5 lg:py-2.5">
      <Skeleton width={36} height={28} />
    </div>
  </div>
);

const PageViewsSkeleton = () => (
  <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
    <div className="flex flex-col gap-2">
      <Skeleton width={240} height={32} />
      <Skeleton width={340} height={16} className="max-w-full" />
    </div>

    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      {statColors.map((color, index) => (
        <div
          key={color}
          className="relative overflow-hidden border border-background-second/20 bg-background p-3 shadow-sm lg:p-5"
        >
          <Skeleton
            height={4}
            color={color}
            className="absolute inset-x-0 top-0"
          />
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton width={index === 2 ? 110 : 130} height={14} />
              <Skeleton width={90} height={30} />
              <Skeleton width={150} height={12} />
            </div>
            <Skeleton width={48} height={48} color={color} />
          </div>
        </div>
      ))}
    </section>

    <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
      <SectionHeadingSkeleton />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border border-background-second/20 bg-background p-3 shadow-sm"
          >
            <Skeleton width={72} height={12} />
            <Skeleton width={64} height={22} />
            <Skeleton width={44} height={12} />
          </div>
        ))}
      </div>
    </section>

    <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
      <SectionHeadingSkeleton />
      <TableSkeleton />
    </section>

    <section className="flex flex-col gap-3 border border-background-second/20 bg-background p-3 shadow-sm lg:gap-4 lg:p-4">
      <SectionHeadingSkeleton />
      <TableSkeleton />
    </section>
  </div>
);

export default PageViewsSkeleton;
