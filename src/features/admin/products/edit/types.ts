import { z } from "zod";
import { createProductSchema } from "../create/form/schema";
import { editProductSchema } from "./form/schema";

export type CreateProductFormValues = z.input<typeof createProductSchema>;

export type EditProductFormValues = z.input<typeof editProductSchema>;

export interface ProductCategory {
  id: string;
  title: string;
}

export interface ProductWeightOption {
  id: string;
  name: string;
  minWeight: number;
  maxWeight: number;
}

export interface Product {
  id: string;
  title: string;
  desc: string | null;
  image: string | null;
  price: number;
  discountPrice: number | null;
  unit: "KG" | "PIECE";
  saleType: "NORMAL" | "WEIGHT_RANGE";
  weightOptions: ProductWeightOption[];
  categoryId: string | null;
  category: ProductCategory | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProps {
  product: Product;
  categories: {
    id: string;
    title: string;
    parentId: string | null;
  }[];
}
