"use client";

import { Heart, Package, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { ProductCardProps } from "./types";
import ProductPrice from "./ProductPrice";
import AddToCartDialog from "../cart/AddToCartDialog";
import { useDialog } from "@/components/dialog";

const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { openDialog } = useDialog();

  const unitLabel = product.unit === "KG" ? "كيلو" : "قطعة";

  return (
    <Card
      className={`group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-main/30 hover:shadow-md ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-main/60">
            <Package className="size-12" />
          </div>
        )}

        {product.discountPrice !== null &&
          product.discountPrice < product.price && (
            <span className="absolute right-2 top-2 bg-main px-2 py-1 text-xs font-semibold text-main-foreground">
              خصم
            </span>
          )}

        {/* Favorite */}
        <Button
          type="button"
          className="absolute left-2 top-2 size-7 backdrop-blur-sm lg:size-8 flex items-center justify-center rounded-full"
          size="icon"
          color="MAIN"
          variant="ghost"
          onClick={() => setIsFavorite((prev) => !prev)}
          aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        >
          <Heart className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>

        {/* Cart */}
        <Button
          type="button"
          className="absolute bottom-2 left-2 flex size-7 items-center justify-center backdrop-blur-sm transition-all duration-200 lg:size-8"
          size="icon"
          color="SUCCESS"
          variant="soft"
          onClick={() =>
            openDialog({
              title: "إضافة إلى السلة",
              size: "md",
              children: <AddToCartDialog product={product} />,
            })
          }
          aria-label="إضافة إلى السلة"
        >
          <ShoppingCart className="size-4 animate-[cart-attention_3s_ease-in-out_infinite]" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-3 lg:gap-2 lg:p-4">
        <div className="min-w-0 flex flex-col gap-0.5 lg:gap-1.5">
          <h3 className="text-base font-semibold transition-colors group-hover:text-main lg:text-lg">
            {product.title}
          </h3>

          <span className="block text-xs text-muted-foreground">
            {unitLabel}
          </span>
        </div>

        <ProductPrice
          price={product.price}
          discountPrice={product.discountPrice}
        />
      </div>
    </Card>
  );
};

export default ProductCard;
