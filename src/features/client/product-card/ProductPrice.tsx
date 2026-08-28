interface ProductPriceProps {
  price: number;
  discountPrice: number | null;
}

const ProductPrice = ({ price, discountPrice }: ProductPriceProps) => {
  const hasDiscount = discountPrice !== null && discountPrice < price;

  const currentPrice = hasDiscount ? discountPrice : price;

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-base font-bold text-main">
        {currentPrice.toLocaleString("ar-EG")} ج.م
      </span>

      {hasDiscount && (
        <span className="text-xs text-muted-foreground line-through">
          {price.toLocaleString("ar-EG")} ج.م
        </span>
      )}
    </div>
  );
};

export default ProductPrice;
