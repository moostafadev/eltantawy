"use client";

import Image from "next/image";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/button";
import { useDialog } from "@/components/dialog";
import { addToCartAction } from "@/lib/cart/actions";

import { AddToCartDialogProps } from "./types";

const AddToCartDialog = ({ product }: AddToCartDialogProps) => {
  const { closeDialog } = useDialog();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<"KG" | "HALF_KG">("KG");
  const [isAdded, setIsAdded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isKg = product.unit === "KG";
  const step = isKg && mode === "HALF_KG" ? 0.5 : 1;

  const handleModeChange = (nextMode: "KG" | "HALF_KG") => {
    setMode(nextMode);
    setQuantity(nextMode === "HALF_KG" ? 0.5 : 1);
  };

  const increment = () => {
    setQuantity((current) => current + step);
  };

  const decrement = () => {
    setQuantity((current) => Math.max(step, current - step));
  };

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCartAction({
          productId: product.id,
          qty: quantity,
          unit: product.unit,
        });

        setIsAdded(true);
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleGoToCart = () => {
    closeDialog();
    router.push("/cart");
  };

  return (
    <div className="space-y-5">
      {/* Product */}
      <div className="flex items-center gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <ShoppingCart className="size-6" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold">{product.title}</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {isKg ? "بالكيلو" : "بالقطعة"}
          </p>
        </div>
      </div>

      {/* Success */}
      {isAdded && (
        <div className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
            <Check className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold">تمت إضافة المنتج إلى السلة</p>

            <p className="text-sm text-muted-foreground">
              يمكنك متابعة التسوق أو الانتقال إلى السلة.
            </p>
          </div>
        </div>
      )}

      {/* Unit */}
      {!isAdded && isKg && (
        <div className="space-y-2">
          <p className="text-sm font-medium">طريقة الإضافة</p>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              color="MAIN"
              variant={mode === "KG" ? "soft" : "ghost"}
              onClick={() => handleModeChange("KG")}
              disabled={isPending}
            >
              كيلو
            </Button>

            <Button
              type="button"
              color="MAIN"
              variant={mode === "HALF_KG" ? "soft" : "ghost"}
              onClick={() => handleModeChange("HALF_KG")}
              disabled={isPending}
            >
              نصف كيلو
            </Button>
          </div>
        </div>
      )}

      {/* Quantity */}
      {!isAdded && (
        <div className="space-y-2">
          <p className="text-sm font-medium">الكمية</p>

          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              size="icon"
              color="MAIN"
              variant="soft"
              onClick={decrement}
              disabled={quantity <= step || isPending}
              aria-label="تقليل الكمية"
            >
              <Minus className="size-4" />
            </Button>

            <div className="min-w-24 text-center">
              <span className="text-2xl font-bold">
                {quantity.toLocaleString("ar-EG")}
              </span>

              <span className="mr-1 text-sm text-muted-foreground">
                {isKg ? "كيلو" : "قطعة"}
              </span>
            </div>

            <Button
              type="button"
              size="icon"
              color="MAIN"
              variant="soft"
              onClick={increment}
              disabled={isPending}
              aria-label="زيادة الكمية"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          className="flex-1"
          color="NEUTRAL"
          variant="soft"
          onClick={closeDialog}
          disabled={isPending}
        >
          متابعة التسوق
        </Button>

        {!isAdded ? (
          <Button
            type="button"
            className="flex-1"
            color="SUCCESS"
            variant="soft"
            onClick={handleAddToCart}
            disabled={isPending}
          >
            <ShoppingCart className="size-4" />

            {isPending ? "جاري الإضافة..." : "إضافة إلى السلة"}
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1"
            color="SUCCESS"
            variant="soft"
            onClick={handleGoToCart}
          >
            <ShoppingCart className="size-4" />
            الذهاب إلى السلة
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddToCartDialog;
