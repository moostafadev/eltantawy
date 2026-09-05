import { Check, Circle } from "lucide-react";

import { ClientOrderStatus, clientOrderStatusLabels } from "./types";

interface TimelineEntry {
  id: string;
  status: ClientOrderStatus;
  createdAt: Date;
}

interface Props {
  history: TimelineEntry[];
  currentStatus: ClientOrderStatus;
}

const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderTimeline = ({ history, currentStatus }: Props) => {
  const isCancelled = currentStatus === "CANCELLED";

  return (
    <div className="flex flex-col">
      {history.map((entry, index) => {
        const isLast = index === history.length - 1;
        const isCancelledStep = entry.status === "CANCELLED";

        return (
          <div key={entry.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && (
              <span
                className={`absolute right-[11px] top-6 h-full w-px ${isCancelled ? "bg-danger/30" : "bg-success/30"}`}
              />
            )}

            <div
              className={`z-10 flex size-6 shrink-0 items-center justify-center rounded-full ${
                isCancelledStep
                  ? "bg-danger text-danger-foreground"
                  : "bg-success text-success-foreground"
              }`}
            >
              <Check className="size-3.5" strokeWidth={3} />
            </div>

            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-foreground">
                {clientOrderStatusLabels[entry.status]}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDateTime(entry.createdAt)}
              </p>
            </div>
          </div>
        );
      })}

      {!isCancelled && currentStatus !== "DELIVERED" && (
        <div className="flex gap-3">
          <div className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 text-muted-foreground">
            <Circle className="size-2.5 fill-current" />
          </div>

          <div className="min-w-0 pt-0.5">
            <p className="text-sm font-medium text-muted-foreground">
              بانتظار التحديث التالي
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
