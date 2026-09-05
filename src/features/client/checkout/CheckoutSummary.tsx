"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart/provider";
import { getCartItemKey } from "@/lib/cart/utils";

interface Props {
  deliveryFee: number;
  total: number;
  hasZone: boolean;
}

const CheckoutSummary = ({ deliveryFee, total, hasZone }: Props) => {
  const { cart } = useCart();

  return (
    <aside className="flex h-fit flex-col gap-3 border border-border bg-background p-3 lg:gap-4 lg:p-4 lg:sticky lg:top-20">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <ShoppingBag className="size-5 text-main" />
        ملخص الطلب
      </h2>

      <div className="flex flex-col gap-2 border-b border-border pb-3 lg:pb-4">
        {cart.items.map((item) => (
          <div
            key={getCartItemKey(item.productId, item.unit, item.weightOptionId)}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="min-w-0 truncate text-muted-foreground">
              {item.product.title} × {item.qty.toLocaleString("ar-EG")}
            </span>

            <span className="shrink-0 font-medium">
              {item.total.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 text-sm lg:gap-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">المجموع الفرعي</span>

          <span className="font-medium">
            {cart.subtotal.toLocaleString("ar-EG")} ج.م
          </span>
        </div>

        {cart.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">خصومات المنتجات</span>

            <span className="font-medium text-success">
              -{cart.discount.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        )}

        {cart.discountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {cart.appliedDiscountLabel ?? "الخصم"}
            </span>

            <span className="font-medium text-success">
              -{cart.discountAmount.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">خدمة التوصيل</span>

          <span className="font-medium">
            {hasZone
              ? `${deliveryFee.toLocaleString("ar-EG")} ج.م`
              : "اختر منطقة التوصيل"}
          </span>
        </div>

        <div className="border-t border-border pt-3 lg:pt-4">
          <div className="flex justify-between">
            <span className="font-semibold">الإجمالي</span>

            <strong className="text-xl text-main">
              {total.toLocaleString("ar-EG")} ج.م
            </strong>
          </div>

          {cart.hasApproxItems && (
            <p className="mt-1 text-xs text-muted-foreground">
              الإجمالي تقريبي لعناصر نطاق الوزن، بيتحدد بدقة حسب الوزن الفعلي
              وقت التسليم
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CheckoutSummary;
