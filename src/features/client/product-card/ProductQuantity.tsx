"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/button";

interface ProductQuantityProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const ProductQuantity = ({
  value,
  onChange,
  min = 1,
  max = 99,
}: ProductQuantityProps) => {
  const decrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex h-9 w-fit shrink-0 items-center border border-border bg-background mr-auto">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={decrease}
        disabled={value <= min}
        aria-label="تقليل الكمية"
        className="size-8 rounded-none p-0 text-muted-foreground shadow-none hover:bg-main/5 hover:text-main"
      >
        <Minus className="size-3.5" />
      </Button>

      <span className="flex min-w-7 items-center justify-center px-1 text-sm font-semibold">
        {value}
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={increase}
        disabled={value >= max}
        aria-label="زيادة الكمية"
        className="size-8 rounded-none p-0 text-muted-foreground shadow-none hover:bg-main/5 hover:text-main"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
};

export default ProductQuantity;
