"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/button";
import { useDialog } from "@/components/dialog";
import { useCart } from "@/lib/cart/provider";

import { AddToCartDialogProps } from "./types";

const AddToCartDialog = ({ product }: AddToCartDialogProps) => {
  const { closeDialog } = useDialog();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<"KG" | "HALF_KG">("KG");
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

      setIsAdded(true);
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

      {isAdded && (
        <div className="flex gap-3 border border-success/20 bg-success/5 p-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-success/10 text-success">
            <Check />
          </div>

          <div>
            <p className="font-semibold">تمت الإضافة للسلة</p>

            <p className="text-sm text-muted-foreground">
              يمكنك متابعة التسوق أو الذهاب للسلة
            </p>
          </div>
        </div>
      )}

      {!isAdded && isKg && (
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

      {!isAdded && (
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
      )}

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

        {!isAdded ? (
          <Button
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
        ) : (
          <Link href="/cart" onClick={closeDialog} className="flex-1">
            <Button className="w-full" variant="soft" color="SUCCESS">
              <ShoppingCart className="size-4" />
              الذهاب للسلة
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AddToCartDialog;
