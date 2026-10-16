export type ProductUnit = "KG" | "PIECE";

export type ProductSaleType = "NORMAL" | "WEIGHT_RANGE";
export type ProductStatus = "AVAILABLE" | "HIDDEN" | "OUT_OF_STOCK";

export interface ProductWeightOption {
  id: string;
  name: string;
  minWeight: number;
  maxWeight: number;
}

export interface ProductCardProduct {
  id: string;
  title: string;
  image: string | null;
  price: number;
  discountPrice: number | null;
  unit: ProductUnit;
  saleType?: ProductSaleType;
  status: ProductStatus; // <-- new
  weightOptions?: ProductWeightOption[];
}

export interface ProductCardProps {
  product: ProductCardProduct;
  className?: string;
}
