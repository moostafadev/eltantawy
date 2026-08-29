"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/button";
import { removeFromCartAction, updateCartItemAction } from "@/lib/cart/actions";
import { CartItemWithProduct } from "@/lib/cart/types";

interface CartItemProps {
  item: CartItemWithProduct;
}

const CartItem = ({ item }: CartItemProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isKg = item.unit === "KG";
  const step = isKg ? 0.5 : 1;

  const increment = () => {
    startTransition(async () => {
      await updateCartItemAction({
        productId: item.productId,
        qty: item.qty + step,
      });

      router.refresh();
    });
  };

  const decrement = () => {
    if (item.qty <= step) {
      return;
    }

    startTransition(async () => {
      await updateCartItemAction({
        productId: item.productId,
        qty: item.qty - step,
      });

      router.refresh();
    });
  };

  const remove = () => {
    startTransition(async () => {
      await removeFromCartAction(item.productId);

      router.refresh();
    });
  };

  return (
    <article className="flex gap-3 border-b border-border py-3 lg:py-4 last:border-b-0 sm:gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden bg-muted sm:size-24">
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.title}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            لا توجد صورة
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{item.product.title}</h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {isKg ? "كيلو" : "قطعة"}
            </p>
          </div>

          <Button
            type="button"
            size="icon"
            color="DANGER"
            variant="ghost"
            onClick={remove}
            disabled={isPending}
            aria-label="حذف المنتج"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              color="MAIN"
              variant="soft"
              onClick={decrement}
              disabled={isPending || item.qty <= step}
              aria-label="تقليل الكمية"
            >
              <Minus className="size-3.5" />
            </Button>

            <span className="min-w-14 text-center text-sm font-semibold">
              {item.qty.toLocaleString("ar-EG")} {isKg ? "كجم" : "قطعة"}
            </span>

            <Button
              type="button"
              size="icon"
              color="MAIN"
              variant="soft"
              onClick={increment}
              disabled={isPending}
              aria-label="زيادة الكمية"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          <div className="text-left">
            <p className="font-bold text-main">
              {item.total.toLocaleString("ar-EG")} ج.م
            </p>

            {item.product.discountPrice !== null &&
              item.product.discountPrice < item.product.price && (
                <p className="text-xs text-muted-foreground line-through">
                  {(item.product.price * item.qty).toLocaleString("ar-EG")} ج.م
                </p>
              )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
