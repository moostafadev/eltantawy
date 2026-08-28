"use client";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/button";

interface ProductCartButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const ProductCartButton = ({
  onClick,
  disabled = false,
}: ProductCartButtonProps) => {
  return (
    <Button
      type="button"
      color="MAIN"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 w-full"
    >
      <ShoppingCart className="size-4" />
      <span>أضف للسلة</span>
    </Button>
  );
};

export default ProductCartButton;
