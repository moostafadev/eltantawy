"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/button";
import { Tag } from "@/components/tag";
import { useToast } from "@/components/toaster";

import { updateOrderStatusAction } from "./updateOrderStatus.service";
import {
  OrderStatusEnum,
  orderStatusColors,
  orderStatusLabels,
  orderStatusTransitions,
} from "./types";

interface Props {
  orderId: string;
  currentStatus: OrderStatusEnum;
}

const statusButtonColor: Record<
  OrderStatusEnum,
  "SUCCESS" | "DANGER" | "INFO" | "MAIN"
> = {
  PENDING: "INFO",
  CONFIRMED: "INFO",
  PREPARING: "MAIN",
  OUT_FOR_DELIVERY: "MAIN",
  DELIVERED: "SUCCESS",
  CANCELLED: "DANGER",
};

const StatusChanger = ({ orderId, currentStatus }: Props) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState<OrderStatusEnum | null>(null);

  const allowedTransitions = orderStatusTransitions[currentStatus];

  const handleChange = async (nextStatus: OrderStatusEnum) => {
    setLoading(nextStatus);

    try {
      const result = await updateOrderStatusAction(orderId, nextStatus);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          الحالة الحالية:
        </span>

        <Tag color={orderStatusColors[currentStatus]} variant="soft">
          {orderStatusLabels[currentStatus]}
        </Tag>
      </div>

      {allowedTransitions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allowedTransitions.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant="soft"
              color={statusButtonColor[status]}
              loading={loading === status}
              disabled={loading !== null && loading !== status}
              onClick={() => handleChange(status)}
            >
              {status === "CANCELLED" ? (
                <X className="size-4" />
              ) : (
                <Check className="size-4" />
              )}
              <span>تحويل إلى {orderStatusLabels[status]}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusChanger;
