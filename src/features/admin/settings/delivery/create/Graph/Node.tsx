import { FolderTree } from "lucide-react";

import { toArabicNums } from "@/utils/toArabicNums";

import { INodeProps } from "./types";

const DeliveryZoneNode = ({ zone, zones, isRoot = false }: INodeProps) => {
  const children = zones.filter((item) => item.parentId === zone.id);

  const hasChildren = children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`group relative z-10 min-w-48 border bg-background px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          isRoot ? "border-main/40 shadow-main/5" : "border-border"
        } ${!zone.isActive ? "opacity-60" : ""}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center ${
              isRoot ? "bg-main/10 text-main" : "bg-muted text-muted-foreground"
            }`}
          >
            <FolderTree className="size-4" />
          </div>

          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-semibold">{zone.title}</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {hasChildren
                ? `${children.length} منطقة فرعية`
                : zone.cost !== null
                  ? `${toArabicNums(String(zone.cost))} ج.م`
                  : "بدون تكلفة"}
            </p>
          </div>
        </div>

        {isRoot && (
          <div className="absolute -top-2.5 right-4 bg-main px-2.5 py-0.5 text-[10px] font-medium text-main-foreground">
            المنطقة المحددة
          </div>
        )}
      </div>

      {hasChildren && (
        <>
          <div className="h-8 w-px bg-border" />

          <div className="relative flex gap-6 pt-0">
            {children.map((child) => (
              <div
                key={child.id}
                className="relative flex flex-col items-center"
              >
                <div className="absolute -top-px left-1/2 h-px w-[calc(100%+1.5rem)] -translate-x-1/2 bg-border" />

                <div className="h-8 w-px bg-border" />

                <DeliveryZoneNode zone={child} zones={zones} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryZoneNode;
