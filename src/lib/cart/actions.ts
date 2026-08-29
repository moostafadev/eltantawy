"use server";

import { revalidatePath } from "next/cache";

import { CartService } from "./service";
import { CartUnit } from "./types";

export const addToCartAction = async (data: {
  productId: string;
  qty: number;
  unit: CartUnit;
}) => {
  const cart = await CartService.addItem(data);

  revalidatePath("/cart");

  return {
    success: true,
    cart,
  };
};

export const updateCartItemAction = async (data: {
  productId: string;
  qty: number;
}) => {
  const cart = await CartService.updateItem(data);

  revalidatePath("/cart");

  return {
    success: true,
    cart,
  };
};

export const removeFromCartAction = async (productId: string) => {
  const cart = await CartService.removeItem(productId);

  revalidatePath("/cart");

  return {
    success: true,
    cart,
  };
};

export const clearCartAction = async () => {
  const cart = await CartService.clear();

  revalidatePath("/cart");

  return {
    success: true,
    cart,
  };
};
