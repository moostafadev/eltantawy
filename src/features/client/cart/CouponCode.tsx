"use client";

import { useState } from "react";
import { Tag as TagIcon, X } from "lucide-react";

import { Button } from "@/components/button";
import { useToast } from "@/components/toaster";
import { useCart } from "@/lib/cart/provider";

const CouponCode = () => {
  const { cart, applyCoupon, removeCoupon, isApplyingCoupon } = useCart();
  const { toast } = useToast();

  const [code, setCode] = useState("");

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error("يرجى إدخال كود الخصم");
      return;
    }

    const result = await applyCoupon(code);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setCode("");
  };

  const handleRemove = async () => {
    await removeCoupon();
    toast.success("تم إلغاء كود الخصم");
  };

  if (cart.couponCode) {
    const isWinning = cart.appliedDiscountSource === "COUPON";

    return (
      <div className="flex items-center justify-between gap-2 border border-success/30 bg-success/5 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <TagIcon className="size-4 shrink-0 text-success" />

          <div className="min-w-0">
            <p dir="ltr" className="truncate text-sm font-bold text-success">
              {cart.couponCode}
            </p>

            <p className="text-xs text-muted-foreground">
              {isWinning
                ? `وفرت ${cart.couponDiscountAmount.toLocaleString("ar-EG")} ج.م`
                : "يوجد خصم تلقائي أفضل مطبق حاليًا"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="icon"
          color="DANGER"
          variant="ghost"
          onClick={handleRemove}
          disabled={isApplyingCoupon}
          aria-label="إلغاء كود الخصم"
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          type="button"
          color="MAIN"
          variant="soft"
          size="sm"
          onClick={handleApply}
          loading={isApplyingCoupon}
        >
          تطبيق
        </Button>
        <input
          dir="ltr"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="كود الخصم"
          disabled={isApplyingCoupon}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
          className="min-w-0 flex-1 border border-main/20 bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-main/60 focus:shadow-md focus:ring-2 focus:ring-main/15 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
};

export default CouponCode;
