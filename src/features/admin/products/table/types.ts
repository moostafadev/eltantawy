import { ProductUnit, ProductSaleType } from "@prisma/client";
import { ProductStatus } from "../status";

export interface Product {
  id: string;
  title: string;
  desc: string | null;
  image: string | null;
  price: number;
  discountPrice: number | null;
  unit: ProductUnit;
  saleType: ProductSaleType;
  status: ProductStatus;
  categoryId: string | null;
  category: {
    id: string;
    title: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
