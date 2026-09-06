"use client";

import { useState } from "react";
import { Check, Scale } from "lucide-react";

import { Button } from "@/components/button";
import { useToast } from "@/components/toaster";
import { toArabicNums } from "@/utils/toArabicNums";

import { confirmItemActualWeightAction } from "./confirmWeight.service";

interface Props {
  orderItemId: string;
  minWeight: number | null;
  maxWeight: number | null;
}

/**
 * نموذج صغير مضمّن جوه صفحة تفاصيل الطلب، لإدخال وتأكيد الوزن الفعلي
 * لعنصر طلب واحد من نوع "نطاق وزن". يُستخدم بشكل مستقل لكل عنصر
 * (تأكيد جزئي، مش لازم كل العناصر مرة واحدة).
 */
const ConfirmWeightForm = ({ orderItemId, minWeight, maxWeight }: Props) => {
  const { toast } = useToast();

  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const value = Number(weight);

    if (!weight || !Number.isFinite(value) || value <= 0) {
      toast.error("يرجى إدخال وزن فعلي صحيح");
      return;
    }

    setLoading(true);

    try {
      const result = await confirmItemActualWeightAction(orderItemId, value);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setWeight("");
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 border border-warning/30 bg-warning/5 p-2">
      <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-warning">
        <Scale className="size-3.5 shrink-0" />
        <span>
          الوزن الفعلي مطلوب
          {minWeight !== null && maxWeight !== null && (
            <>
              {" "}
              (بين {toArabicNums(minWeight)} و {toArabicNums(maxWeight)} كجم)
            </>
          )}
        </span>
      </div>

      <div className="mr-auto flex items-center gap-2">
        <input
          type="number"
          min={minWeight ?? 0}
          max={maxWeight ?? undefined}
          step={0.01}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          disabled={loading}
          placeholder="مثال: 1.25"
          className="w-24 border border-main/20 bg-background px-2 py-1 text-center text-sm outline-none focus:border-main/60 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <Button
          type="button"
          size="xs"
          color="SUCCESS"
          variant="soft"
          loading={loading}
          onClick={handleConfirm}
        >
          <Check className="size-3.5" />
          <span>تأكيد الوزن</span>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmWeightForm;
