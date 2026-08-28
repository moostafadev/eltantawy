import { Skeleton } from "@/components/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="overflow-hidden border border-background-second/60 bg-background shadow-sm">
      {/* User Header */}
      <div className="flex flex-col gap-4 border-b border-background-second/60 p-3 sm:flex-row sm:items-center lg:p-4">
        <Skeleton width={64} height={64} className="shrink-0 rounded-full" />

        <div className="flex flex-col gap-1">
          <Skeleton width={180} height={24} />

          <Skeleton width={220} height={20} />
        </div>
      </div>

      {/* Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-1 border-b border-background-second/60 p-3 last:border-b-0 sm:odd:border-l lg:gap-1.5 lg:p-4"
          >
            <Skeleton width={90} height={16} />

            <Skeleton width={150} height={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
