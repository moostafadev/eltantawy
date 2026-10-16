"use client";

import { Scale, ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart/provider";
import { getCartItemKey } from "@/lib/cart/utils";

interface Props {
  deliveryFee: number;
  total: number;
  minTotal: number;
  maxTotal: number;
  hasApproxItems: boolean;
  hasZone: boolean;
}

const CheckoutSummary = ({
  deliveryFee,
  total,
  minTotal,
  maxTotal,
  hasApproxItems,
  hasZone,
}: Props) => {
  const { cart } = useCart();

  /*
   * Recompute the subtotal as a range when the cart contains weight-range
   * items. `cart.subtotal` uses the midpoint weight, so we compute the min
   * and max bounds here so the user sees the same approximation that the
   * cart page shows.
   */
  const minSubtotal = cart.items.reduce((sum, item) => {
    const multiplier =
      item.isApprox && item.weightOption ? item.weightOption.minWeight : 1;
    return sum + item.product.price * item.qty * multiplier;
  }, 0);

  const maxSubtotal = cart.items.reduce((sum, item) => {
    const multiplier =
      item.isApprox && item.weightOption ? item.weightOption.maxWeight : 1;
    return sum + item.product.price * item.qty * multiplier;
  }, 0);

  return (
    <aside className="flex h-fit flex-col gap-3 border border-border bg-background p-3 lg:gap-4 lg:p-4 lg:sticky lg:top-20">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <ShoppingBag className="size-5 text-main" />
        ملخص الطلب
      </h2>

      {/* Items */}
      <div className="flex flex-col gap-2 border-b border-border pb-3 lg:pb-4">
        {cart.items.map((item) => {
          const key = getCartItemKey(
            item.productId,
            item.unit,
            item.weightOptionId,
          );

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="min-w-0 truncate text-muted-foreground">
                {item.product.title} × {item.qty.toLocaleString("ar-EG")}
              </span>

              <span className="shrink-0 font-medium tabular-nums">
                {item.isApprox
                  ? `${item.minTotal!.toLocaleString("ar-EG")} - ${item.maxTotal!.toLocaleString("ar-EG")}`
                  : item.total.toLocaleString("ar-EG")}{" "}
                ج.م
              </span>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-3 text-sm lg:gap-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">المجموع الفرعي</span>

          {hasApproxItems ? (
            <span className="font-medium tabular-nums">
              {minSubtotal.toLocaleString("ar-EG")} -{" "}
              {maxSubtotal.toLocaleString("ar-EG")} ج.م
            </span>
          ) : (
            <span className="font-medium tabular-nums">
              {cart.subtotal.toLocaleString("ar-EG")} ج.م
            </span>
          )}
        </div>

        {cart.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">خصومات المنتجات</span>

            <span className="font-medium text-success tabular-nums">
              -{cart.discount.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        )}

        {cart.discountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {cart.appliedDiscountLabel ?? "الخصم"}
            </span>

            <span className="font-medium text-success tabular-nums">
              -{cart.discountAmount.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">خدمة التوصيل</span>

          <span className="font-medium tabular-nums">
            {hasZone
              ? `${deliveryFee.toLocaleString("ar-EG")} ج.م`
              : "اختر منطقة التوصيل"}
          </span>
        </div>

        <div className="border-t border-border pt-3 lg:pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">الإجمالي</span>

            {hasApproxItems ? (
              <strong className="text-lg text-main tabular-nums">
                {minTotal.toLocaleString("ar-EG")} -{" "}
                {maxTotal.toLocaleString("ar-EG")} ج.م
              </strong>
            ) : (
              <strong className="text-xl text-main tabular-nums">
                {total.toLocaleString("ar-EG")} ج.م
              </strong>
            )}
          </div>

          {hasApproxItems && (
            <div className="mt-2 flex items-start gap-1.5 border border-warning/30 bg-warning/5 p-2 text-xs leading-5 text-warning">
              <Scale aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              <span>
                بعض المنتجات في الطلب بيع بالوزن التقريبي. السعر النهائي بيتحدد
                بعد وزن المنتجات فعليًا من إدارة المتجر.
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CheckoutSummary;
