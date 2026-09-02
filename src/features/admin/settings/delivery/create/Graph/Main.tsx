"use client";

import { memo, useContext, useMemo } from "react";
import { FolderTree } from "lucide-react";

import DeliveryZoneNode from "./Node";
import { IGraphProps } from "./types";
import { DeliveryZoneCreateStateContext } from "../store";

const DeliveryZoneGraph = ({ zones, selectedId }: IGraphProps) => {
  const context = useContext(DeliveryZoneCreateStateContext);

  const currentSelectedId = selectedId ?? context?.selectedParentId;

  const selectedZone = useMemo(() => {
    if (!currentSelectedId) {
      return undefined;
    }

    return zones.find((zone) => zone.id === currentSelectedId);
  }, [zones, currentSelectedId]);

  if (!currentSelectedId) {
    return (
      <div className="flex min-h-64 flex-1 flex-col items-center justify-center border border-dashed border-background-second bg-muted/20 px-6 text-center">
        <div className="mb-3 flex size-12 items-center justify-center bg-muted">
          <FolderTree className="size-5 text-muted-foreground" />
        </div>

        <p className="text-sm font-medium">اختر منطقة لعرض الهيكل</p>

        <p className="mt-1 text-xs text-muted-foreground">
          ستظهر هنا جميع المناطق الفرعية التابعة لها
        </p>
      </div>
    );
  }

  if (!selectedZone) {
    return null;
  }

  return (
    <section className="flex-1 overflow-hidden border border-background-second bg-background shadow-sm">
      <div className="flex items-center justify-between gap-1 lg:gap-1.5 flex-wrap border-b border-background-second bg-muted/30 p-3 lg:p-4">
        <div className="flex flex-col gap-1 lg:gap-1.5">
          <h2 className="text-sm font-semibold">هيكل مناطق التوصيل</h2>

          <p className="text-xs text-muted-foreground">
            المناطق التابعة لـ {selectedZone.title}
          </p>
        </div>

        <div className="flex size-9 items-center justify-center bg-main/10 text-main mr-auto">
          <FolderTree className="size-4" />
        </div>
      </div>

      <div className="overflow-x-auto p-8">
        <div className="flex min-w-max justify-center">
          <DeliveryZoneNode zone={selectedZone} zones={zones} isRoot />
        </div>
      </div>
    </section>
  );
};

export default memo(DeliveryZoneGraph);
