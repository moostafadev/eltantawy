export type ProductUnit = "KG" | "PIECE";

export interface ProductCardProduct {
  id: string;
  title: string;
  image: string | null;
  price: number;
  discountPrice: number | null;
  unit: ProductUnit;
}

export interface ProductCardProps {
  product: ProductCardProduct;
  className?: string;
}
