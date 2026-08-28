import { ProductUnit } from "@prisma/client";

export interface Product {
  id: string;
  title: string;
  desc: string | null;
  image: string | null;
  price: number;
  discountPrice: number | null;
  unit: ProductUnit;
  categoryId: string | null;
  category: {
    id: string;
    title: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
