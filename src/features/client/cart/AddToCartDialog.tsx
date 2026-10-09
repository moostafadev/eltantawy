"use client";

import { LoadingImage as Image } from "@/components/loading-image";
import { useMemo, useRef, useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/button";
import { Tooltip } from "@/components/tooltip";
import { useDialog } from "@/components/dialog";
import { useCart } from "@/lib/cart/provider";
import { flyToCart } from "@/lib/cart/flyToCart";

import { AddToCartDialogProps } from "./types";

const AddToCartDialog = ({ product }: AddToCartDialogProps) => {
  const { closeDialog } = useDialog();
  const { addItem } = useCart();

  const isWeightRange =
    product.saleType === "WEIGHT_RANGE" &&
    !!product.weightOptions &&
    product.weightOptions.length > 0;

  const isKg = product.unit === "KG";

  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<"KG" | "HALF_KG">("KG");
  const [selectedOptionId, setSelectedOptionId] = useState(
    isWeightRange ? product.weightOptions![0].id : "",
  );
  const [isLoading, setIsLoading] = useState(false);

  const addButtonRef = useRef<HTMLButtonElement | null>(null);

  const selectedOption = useMemo(
    () =>
      product.weightOptions?.find((option) => option.id === selectedOptionId),
    [product.weightOptions, selectedOptionId],
  );

  // For weight-range products, quantity is always an integer package count.
  const step = isKg && !isWeightRange && mode === "HALF_KG" ? 0.5 : 1;

  const unitPrice =
    product.discountPrice !== null && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  // Approximate price range for the selected option multiplied by package count.
  const approxPriceRange = useMemo(() => {
    if (!isWeightRange || !selectedOption) return null;

    const minTotal = selectedOption.minWeight * unitPrice * quantity;
    const maxTotal = selectedOption.maxWeight * unitPrice * quantity;

    return { min: minTotal, max: maxTotal };
  }, [isWeightRange, selectedOption, unitPrice, quantity]);

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
        weightOptionId: isWeightRange ? selectedOptionId : undefined,
      });

      // Run this before closeDialog to capture the button position before the
      // dialog is removed from the DOM.
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

      {isWeightRange ? (
        <div className="space-y-2.5">
          <p className="text-sm font-medium">اختر الوزن التقريبي</p>

          <div className="grid grid-cols-2 gap-2.5">
            {product.weightOptions!.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant="card"
                selected={selectedOptionId === option.id}
                onClick={() => setSelectedOptionId(option.id)}
                disabled={isLoading}
                className="py-3"
              >
                <span className="font-semibold">{option.name}</span>

                <span className="text-xs text-muted-foreground">
                  {option.minWeight.toLocaleString("ar-EG")} -{" "}
                  {option.maxWeight.toLocaleString("ar-EG")} كجم
                </span>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        isKg && (
          <div className="space-y-2.5">
            <p className="text-sm font-medium">طريقة الإضافة</p>

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                variant="card"
                selected={mode === "KG"}
                onClick={() => changeMode("KG")}
                disabled={isLoading}
                className="py-3"
              >
                <span className="font-semibold">كيلو</span>
              </Button>

              <Button
                type="button"
                variant="card"
                selected={mode === "HALF_KG"}
                onClick={() => changeMode("HALF_KG")}
                disabled={isLoading}
                className="py-3"
              >
                <span className="font-semibold">نصف كيلو</span>
              </Button>
            </div>
          </div>
        )
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium">
          {isWeightRange ? " العدد" : "الكمية"}
        </p>

        <div className="flex items-center justify-center gap-4">
          <Tooltip content="تقليل الكمية" focusable={false}>
            <Button
              type="button"
              size="icon"
              variant="soft"
              color="MAIN"
              onClick={decrement}
              disabled={quantity <= step || isLoading}
              aria-label="تقليل الكمية"
            >
              <Minus aria-hidden="true" />
            </Button>
          </Tooltip>

          <div className="min-w-24 text-center">
            <strong className="text-2xl">
              {quantity.toLocaleString("ar-EG")}
            </strong>

            <span className="mr-1 text-sm text-muted-foreground">
              {isWeightRange ? "" : isKg ? "كيلو" : "قطعة"}
            </span>
          </div>

          <Tooltip content="زيادة الكمية" focusable={false}>
            <Button
              type="button"
              size="icon"
              variant="soft"
              color="MAIN"
              onClick={increment}
              disabled={isLoading}
              aria-label="زيادة الكمية"
            >
              <Plus aria-hidden="true" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {isWeightRange && approxPriceRange && (
        <div className="flex flex-col items-center gap-1 border border-background-second bg-muted/30 p-3 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            السعر التقريبي
          </p>

          <strong className="text-lg text-main">
            {approxPriceRange.min.toLocaleString("ar-EG")} -{" "}
            {approxPriceRange.max.toLocaleString("ar-EG")} ج.م
          </strong>

          <p className="text-xs text-muted-foreground">
            السعر النهائي يتحدد حسب الوزن الفعلي وقت التسليم
          </p>
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

        <Button
          ref={addButtonRef}
          type="button"
          className="flex-1"
          variant="soft"
          color="SUCCESS"
          onClick={handleAdd}
          loading={isLoading}
          disabled={isWeightRange && !selectedOption}
        >
          <ShoppingCart className="size-4" />
          إضافة للسلة
        </Button>
      </div>
    </div>
  );
};

export default AddToCartDialog;
