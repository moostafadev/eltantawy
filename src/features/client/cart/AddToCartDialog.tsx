"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/button";
import { useDialog } from "@/components/dialog";
import { useCart } from "@/lib/cart/provider";
import { flyToCart } from "@/lib/cart/flyToCart";

import { AddToCartDialogProps } from "./types";

const AddToCartDialog = ({ product }: AddToCartDialogProps) => {
  const { closeDialog } = useDialog();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<"KG" | "HALF_KG">("KG");
  const [isLoading, setIsLoading] = useState(false);

  const addButtonRef = useRef<HTMLButtonElement | null>(null);

  const isKg = product.unit === "KG";

  const step = isKg && mode === "HALF_KG" ? 0.5 : 1;

  const changeMode = (next: "KG" | "HALF_KG") => {
    setMode(next);
    setQuantity(next === "HALF_KG" ? 0.5 : 1);
  };

  const increment = () => {
    setQuantity((current) => current + step);
  };

  const decrement = () => {
    setQuantity((current) => Math.max(step, current - step));
  };

  const handleAdd = async () => {
    setIsLoading(true);

    try {
      await addItem({
        productId: product.id,
        qty: quantity,
        unit: product.unit as "KG" | "PIECE",
      });

      // لازم تتنفذ قبل closeDialog عشان تاخد مكان الزرار
      // قبل ما الـ Dialog يتشال من الـ DOM
      flyToCart(addButtonRef.current, product.image ?? undefined);

      closeDialog();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <div className="flex gap-3">
        <div className="relative size-16 overflow-hidden bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ShoppingCart className="size-6" />
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold">{product.title}</h3>

          <p className="text-sm text-muted-foreground">
            {isKg ? "بالكيلو" : "بالقطعة"}
          </p>
        </div>
      </div>

      {isKg && (
        <div className="space-y-2">
          <p className="text-sm font-medium">طريقة الإضافة</p>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              color="MAIN"
              variant={mode === "KG" ? "soft" : "ghost"}
              onClick={() => changeMode("KG")}
              disabled={isLoading}
            >
              كيلو
            </Button>

            <Button
              type="button"
              color="MAIN"
              variant={mode === "HALF_KG" ? "soft" : "ghost"}
              onClick={() => changeMode("HALF_KG")}
              disabled={isLoading}
            >
              نصف كيلو
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium">الكمية</p>

        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            size="icon"
            variant="soft"
            color="MAIN"
            onClick={decrement}
            disabled={quantity <= step || isLoading}
          >
            <Minus />
          </Button>

          <div className="min-w-24 text-center">
            <strong className="text-2xl">
              {quantity.toLocaleString("ar-EG")}
            </strong>

            <span className="mr-1 text-sm text-muted-foreground">
              {isKg ? "كيلو" : "قطعة"}
            </span>
          </div>

          <Button
            type="button"
            size="icon"
            variant="soft"
            color="MAIN"
            onClick={increment}
            disabled={isLoading}
          >
            <Plus />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          className="flex-1"
          variant="soft"
          color="NEUTRAL"
          onClick={closeDialog}
          disabled={isLoading}
        >
          متابعة التسوق
        </Button>

        <Button
          ref={addButtonRef}
          type="button"
          className="flex-1"
          variant="soft"
          color="SUCCESS"
          onClick={handleAdd}
          loading={isLoading}
        >
          <ShoppingCart className="size-4" />
          إضافة للسلة
        </Button>
      </div>
    </div>
  );
};

export default AddToCartDialog;
