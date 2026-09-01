"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/button";
import { CartItemWithProduct } from "@/lib/cart/types";
import { useCart } from "@/lib/cart/provider";

interface CartItemProps {
  item: CartItemWithProduct;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateItem, removeItem, isItemUpdating } = useCart();

  const key = `${item.productId}-${item.unit}`;

  const isUpdating = isItemUpdating(key);

  const isKg = item.unit === "KG";

  const step = isKg ? 0.5 : 1;

  const increment = () => {
    updateItem(item.productId, item.unit, item.qty + step);
  };

  const decrement = () => {
    if (item.qty <= step) {
      return;
    }

    updateItem(item.productId, item.unit, item.qty - step);
  };

  const remove = () => {
    removeItem(item.productId, item.unit);
  };

  const hasDiscount =
    item.product.discountPrice !== null &&
    item.product.discountPrice < item.product.price;

  const originalTotal = item.product.price * item.qty;

  return (
    <article className="flex gap-3 border-b border-border py-3 last:border-b-0 sm:gap-4 lg:py-4">
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
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            لا توجد صورة
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{item.product.title}</h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {isKg ? "بالكيلو" : "بالقطعة"}
            </p>
          </div>

          <Button
            type="button"
            size="icon"
            color="DANGER"
            variant="ghost"
            onClick={remove}
            loading={isUpdating}
            disabled={isUpdating}
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
              disabled={isUpdating || item.qty <= step}
            >
              <Minus className="size-3.5" />
            </Button>

            <div className="min-w-16 text-center text-sm font-semibold">
              {item.qty.toLocaleString("ar-EG")}

              <span className="mr-1 text-xs font-normal text-muted-foreground">
                {isKg ? "كجم" : "قطعة"}
              </span>
            </div>

            <Button
              type="button"
              size="icon"
              color="MAIN"
              variant="soft"
              onClick={increment}
              disabled={isUpdating}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          <div className="text-left">
            <p className="font-bold text-main">
              {item.total.toLocaleString("ar-EG")}
              ج.م
            </p>

            {hasDiscount && (
              <p className="text-xs text-muted-foreground line-through">
                {originalTotal.toLocaleString("ar-EG")}
                ج.م
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
