"use client";

import { Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Card } from "@/components/card";
import { ProductCardProps } from "./types";
import ProductPrice from "./ProductPrice";
import ProductQuantity from "./ProductQuantity";
import ProductCartButton from "./ProductCartButton";

const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log("Add to cart:", {
      productId: product.id,
      quantity,
    });
  };

  const unitLabel = product.unit === "KG" ? "كيلو" : "قطعة";

  return (
    <Card
      className={`group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-main/30 hover:shadow-md ${className}`}
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
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 transition-colors group-hover:text-main">
            {product.title}
          </h3>

          <span className="mt-1 block text-xs text-muted-foreground">
            {unitLabel}
          </span>
        </div>

        <ProductPrice
          price={product.price}
          discountPrice={product.discountPrice}
        />

        <div className="mt-auto flex items-center gap-1 lg:gap-2 flex-col lg:flex-row">
          <ProductQuantity value={quantity} onChange={setQuantity} />

          <ProductCartButton onClick={handleAddToCart} />
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
