"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/button";
import { useToast } from "@/components/toaster";

import { updateReturnStatusAction } from "./updateReturnStatus.service";
import { ReturnStatusEnum, returnStatusTransitions } from "./types";

interface Props {
  returnId: string;
  currentStatus: ReturnStatusEnum;
}

const returnActionLabel: Record<ReturnStatusEnum, string> = {
  PENDING: "",
  APPROVED: "الموافقة",
  REJECTED: "الرفض",
  REFUNDED: "تنفيذ الاسترجاع",
};

const returnActionColor: Record<
  ReturnStatusEnum,
  "SUCCESS" | "DANGER" | "INFO" | "MAIN"
> = {
  PENDING: "INFO",
  APPROVED: "SUCCESS",
  REJECTED: "DANGER",
  REFUNDED: "MAIN",
};

const ReturnStatusChanger = ({ returnId, currentStatus }: Props) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState<ReturnStatusEnum | null>(null);

  const allowedTransitions = returnStatusTransitions[currentStatus];

  if (allowedTransitions.length === 0) return null;

  const handleChange = async (nextStatus: ReturnStatusEnum) => {
    setLoading(nextStatus);

    try {
      const result = await updateReturnStatusAction(returnId, nextStatus);

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
    <div className="flex flex-wrap gap-1.5">
      {allowedTransitions.map((status) => (
        <Button
          key={status}
          type="button"
          size="xs"
          variant="soft"
          color={returnActionColor[status]}
          loading={loading === status}
          disabled={loading !== null && loading !== status}
          onClick={() => handleChange(status)}
        >
          {status === "REJECTED" ? (
            <X className="size-3.5" />
          ) : status === "REFUNDED" ? (
            <RotateCcw className="size-3.5" />
          ) : (
            <Check className="size-3.5" />
          )}
          <span>{returnActionLabel[status]}</span>
        </Button>
      ))}
    </div>
  );
};

export default ReturnStatusChanger;
