"use client";

import { useState } from "react";

import { Button } from "@/components/button";
import { useDialog } from "@/components/dialog";
import { useToast } from "@/components/toaster";
import { toArabicNums } from "@/utils/toArabicNums";

import { createReturnAction } from "../createReturn.service";
import { Props } from "./types";

const CreateReturnDialog = ({ orderId, items }: Props) => {
  const { closeDialog } = useDialog();
  const { toast } = useToast();

  const [selectedQtys, setSelectedQtys] = useState<Record<string, number>>({});
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const getAvailableQty = (item: Props["items"][number]) =>
    item.qty - item.returnedQty;

  const handleQtyChange = (itemId: string, value: number, max: number) => {
    const clamped = Math.max(0, Math.min(value, max));

    setSelectedQtys((prev) => ({
      ...prev,
      [itemId]: clamped,
    }));
  };

  const handleSubmit = async () => {
    const returnItems = Object.entries(selectedQtys)
      .filter(([, qty]) => qty > 0)
      .map(([orderItemId, qty]) => ({ orderItemId, qty }));

    if (returnItems.length === 0) {
      toast.error("يرجى تحديد كمية عنصر واحد على الأقل للإرجاع");
      return;
    }

    if (!reason.trim()) {
      toast.error("يرجى كتابة سبب الإرجاع");
      return;
    }

    setLoading(true);

    try {
      const result = await createReturnAction({
        orderId,
        reason,
        items: returnItems,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      closeDialog();
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const max = getAvailableQty(item);

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 border border-background-second/60 p-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.title}</p>

                <p className="text-xs text-muted-foreground">
                  المتاح للإرجاع: {toArabicNums(max)}{" "}
                  {item.unit === "KG" ? "كيلو" : "قطعة"}
                </p>
              </div>

              <input
                type="number"
                min={0}
                max={max}
                step={item.unit === "KG" ? 0.5 : 1}
                value={selectedQtys[item.id] ?? 0}
                onChange={(e) =>
                  handleQtyChange(item.id, Number(e.target.value), max)
                }
                className="w-20 border border-main/20 bg-background px-2 py-1 text-center text-sm outline-none focus:border-main/60"
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">سبب الإرجاع</label>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="مثال: المنتج تالف عند الاستلام"
          className="w-full resize-none border border-main/20 bg-background px-3 py-1.5 text-sm outline-none transition-all duration-200 focus:border-main/60 focus:shadow-md focus:ring-2 focus:ring-main/15"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          color="NEUTRAL"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={closeDialog}
        >
          إلغاء
        </Button>

        <Button
          type="button"
          color="DANGER"
          size="sm"
          loading={loading}
          onClick={handleSubmit}
        >
          إنشاء المرتجع
        </Button>
      </div>
    </div>
  );
};

export default CreateReturnDialog;
