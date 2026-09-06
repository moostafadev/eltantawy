"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/button";
import { useToast } from "@/components/toaster";
import { useCart } from "@/lib/cart/provider";

interface WeightOption {
  id: string;
  name: string;
  minWeight: number;
  maxWeight: number;
}

interface Props {
  productId: string;
  price: number;
  discountPrice: number | null;
  unit: "KG" | "PIECE";
  saleType: "NORMAL" | "WEIGHT_RANGE";
  weightOptions: WeightOption[];
}

/**
 * أزرار اختيار الكمية/الوزن وإضافة المنتج للسلة، مستخدمة داخل صفحة
 * تفاصيل المنتج (بدون Dialog، عكس `AddToCartDialog` المستخدم في الكروت)
 */
const ProductDetailPurchase = ({
  productId,
  price,
  discountPrice,
  unit,
  saleType,
  weightOptions,
}: Props) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const isWeightRange = saleType === "WEIGHT_RANGE" && weightOptions.length > 0;
  const isKg = unit === "KG";

  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<"KG" | "HALF_KG">("KG");
  const [selectedOptionId, setSelectedOptionId] = useState(
    isWeightRange ? weightOptions[0].id : "",
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectedOption = useMemo(
    () => weightOptions.find((option) => option.id === selectedOptionId),
    [weightOptions, selectedOptionId],
  );

  const step = isKg && !isWeightRange && mode === "HALF_KG" ? 0.5 : 1;

  const unitPrice =
    discountPrice !== null && discountPrice < price ? discountPrice : price;

  const approxPriceRange = useMemo(() => {
    if (!isWeightRange || !selectedOption) return null;

    return {
      min: selectedOption.minWeight * unitPrice * quantity,
      max: selectedOption.maxWeight * unitPrice * quantity,
    };
  }, [isWeightRange, selectedOption, unitPrice, quantity]);

  const changeMode = (next: "KG" | "HALF_KG") => {
    setMode(next);
    setQuantity(next === "HALF_KG" ? 0.5 : 1);
  };

  const increment = () => setQuantity((current) => current + step);
  const decrement = () =>
    setQuantity((current) => Math.max(step, current - step));

  const handleAdd = async () => {
    setIsLoading(true);

    try {
      await addItem({
        productId,
        qty: quantity,
        unit,
        weightOptionId: isWeightRange ? selectedOptionId : undefined,
      });

      toast.success("تم إضافة المنتج إلى السلة بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء الإضافة إلى السلة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isWeightRange ? (
        <div className="space-y-2.5">
          <p className="text-sm font-medium">اختر الوزن التقريبي</p>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {weightOptions.map((option) => (
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
          {isWeightRange ? "العدد" : "الكمية"}
        </p>

        <div className="flex items-center gap-4">
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
              {isWeightRange ? "" : isKg ? "كيلو" : "قطعة"}
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

      <Button
        type="button"
        color="SUCCESS"
        size="lg"
        loading={isLoading}
        disabled={isWeightRange && !selectedOption}
        onClick={handleAdd}
        className="w-full"
      >
        <ShoppingCart className="size-4" />
        إضافة للسلة
      </Button>
    </div>
  );
};

export default ProductDetailPurchase;
