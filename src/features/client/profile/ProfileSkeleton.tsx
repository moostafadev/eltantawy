import { Skeleton } from "@/components/skeleton";

const ProfileSkeleton = () => (
  <section className="overflow-hidden border border-background-second/60 bg-background shadow-sm">
    <header className="relative overflow-hidden border-b border-background-second/60 p-4 sm:p-5">
      <div className="pointer-events-none absolute -left-8 -top-12 size-36 rounded-full bg-main/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton
          width={64}
          height={64}
          className="shrink-0 rounded-full border border-main/20 bg-background"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton width={170} height={28} className="max-w-full" />
            <Skeleton width={92} height={24} />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <Skeleton width={16} height={16} className="shrink-0" />
            <Skeleton width={116} height={20} className="max-w-full" />
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-background-second/60 pt-3 sm:border-0 sm:pt-0">
          <Skeleton width={16} height={16} className="shrink-0" />
          <Skeleton width={128} height={16} className="max-w-full" />
        </div>
      </div>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-3.5 lg:p-4"
        >
          <Skeleton
            width={36}
            height={36}
            color="NEUTRAL"
            className="shrink-0"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton width={90} height={16} />
            <Skeleton
              width={[116, 132, 148, 72][index]}
              height={20}
              className="max-w-full"
            />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ProfileSkeleton;
