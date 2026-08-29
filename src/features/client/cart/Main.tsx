"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

const CartSummary = ({
  subtotal,
  discount,
  deliveryFee,
  total,
}: CartSummaryProps) => {
  const router = useRouter();

  return (
    <aside className="flex h-fit flex-col gap-3 border border-border bg-background p-3 lg:gap-4 lg:p-4">
      <h2 className="text-lg font-bold">ملخص السلة</h2>

      <div className="flex flex-col gap-3 text-sm lg:gap-4">
        {/* Subtotal */}
        <div className="flex items-center justify-between gap-3 lg:gap-4">
          <span className="text-muted-foreground">المجموع الفرعي</span>

          <span className="font-medium">
            {subtotal.toLocaleString("ar-EG")} ج.م
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex items-center justify-between gap-3 lg:gap-4">
            <span className="text-muted-foreground">الخصومات</span>

            <span className="font-medium text-success">
              -{discount.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex items-center justify-between gap-3 lg:gap-4">
          <span className="text-muted-foreground">خدمة التوصيل</span>

          <span className="font-medium">
            {deliveryFee.toLocaleString("ar-EG")} ج.م
          </span>
        </div>

        {/* Total */}
        <div className="border-t border-border pt-3 lg:pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold">الإجمالي</span>

            <span className="text-xl font-bold text-main">
              {total.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:gap-3">
        <Button
          type="button"
          className="w-full"
          color="MAIN"
          variant="solid"
          onClick={() => router.push("/checkout")}
        >
          متابعة الطلب
          <ArrowLeft className="size-4" />
        </Button>

        <Button
          type="button"
          className="w-full"
          color="NEUTRAL"
          variant="soft"
          onClick={() => router.push("/")}
        >
          <ShoppingBag className="size-4" />
          متابعة التسوق
        </Button>
      </div>
    </aside>
  );
};

export default CartSummary;
