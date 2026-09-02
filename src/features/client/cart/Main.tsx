"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { Skeleton } from "@/components/skeleton";

import { useCart } from "@/lib/cart/provider";

const CartSummary = () => {
  const router = useRouter();

  const { cart, isUpdating } = useCart();

  const {
    subtotal,
    discount,
    deliveryFee,
    total,
    hasApproxItems,
    minTotal,
    maxTotal,
  } = cart;

  return (
    <aside className="flex h-fit flex-col gap-3 border border-border bg-background p-3 lg:gap-4 lg:p-4 lg:sticky lg:top-20">
      <h2 className="text-lg font-bold">ملخص السلة</h2>

      <div className="flex flex-col gap-3 text-sm lg:gap-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">المجموع الفرعي</span>

          {isUpdating ? (
            <Skeleton width={80} height={16} />
          ) : (
            <span className="font-medium">
              {subtotal.toLocaleString("ar-EG")}
              ج.م
            </span>
          )}
        </div>

        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">الخصومات</span>

            {isUpdating ? (
              <Skeleton width={65} height={16} />
            ) : (
              <span className="font-medium text-success">
                -{discount.toLocaleString("ar-EG")}
                ج.م
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">خدمة التوصيل</span>

          {isUpdating ? (
            <Skeleton width={65} height={16} />
          ) : (
            <span className="font-medium">
              {deliveryFee.toLocaleString("ar-EG")}
              ج.م
            </span>
          )}
        </div>

        <div className="border-t border-border pt-3 lg:pt-4">
          <div className="flex justify-between">
            <span className="font-semibold">الإجمالي</span>

            {isUpdating ? (
              <Skeleton width={100} height={25} />
            ) : hasApproxItems ? (
              <strong className="text-lg text-main">
                {minTotal.toLocaleString("ar-EG")} -{" "}
                {maxTotal.toLocaleString("ar-EG")}
                ج.م
              </strong>
            ) : (
              <strong className="text-xl text-main">
                {total.toLocaleString("ar-EG")}
                ج.م
              </strong>
            )}
          </div>

          {hasApproxItems && !isUpdating && (
            <p className="mt-1 text-xs text-muted-foreground">
              الإجمالي تقريبي، بيتحدد بدقة حسب الوزن الفعلي وقت التسليم
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:gap-3">
        <Button
          type="button"
          className="w-full"
          color="MAIN"
          variant="solid"
          disabled={isUpdating}
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
