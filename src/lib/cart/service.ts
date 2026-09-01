import { cookies } from "next/headers";

import { prisma } from "../prisma";

import {
  CART_COOKIE_NAME,
  CART_COOKIE_OPTIONS,
  CART_DELIVERY_FEE,
} from "./constants";

import {
  addCartItem,
  clearCart,
  parseCart,
  removeCartItem,
  serializeCart,
  updateCartItem,
} from "./utils";

import { Cart, CartItemWithProduct, CartUnit, HydratedCart } from "./types";

export class CartService {
  private static async getCart(): Promise<Cart> {
    const cookieStore = await cookies();

    const cookie = cookieStore.get(CART_COOKIE_NAME);

    return parseCart(cookie?.value);
  }

  private static async saveCart(cart: Cart) {
    const cookieStore = await cookies();

    cookieStore.set(CART_COOKIE_NAME, serializeCart(cart), CART_COOKIE_OPTIONS);
  }

  static async addItem(data: {
    productId: string;

    qty: number;

    unit: CartUnit;
  }): Promise<HydratedCart> {
    this.validateQuantity(data.qty, data.unit);

    const product = await prisma.product.findUnique({
      where: {
        id: data.productId,
      },

      select: {
        id: true,
        unit: true,
      },
    });

    if (!product) {
      throw new Error("المنتج غير موجود");
    }

    if (product.unit !== data.unit) {
      throw new Error("وحدة المنتج غير صحيحة");
    }

    const cart = await this.getCart();

    const updatedCart = addCartItem(cart, data);

    await this.saveCart(updatedCart);

    return this.getHydratedCart();
  }

  static async updateItem(data: {
    productId: string;

    unit: CartUnit;

    qty: number;
  }): Promise<HydratedCart> {
    this.validateQuantity(data.qty, data.unit);

    const cart = await this.getCart();

    const exists = cart.items.some(
      (item) => item.productId === data.productId && item.unit === data.unit,
    );

    if (!exists) {
      throw new Error("المنتج غير موجود في السلة");
    }

    const updatedCart = updateCartItem(
      cart,
      data.productId,
      data.unit,
      data.qty,
    );

    await this.saveCart(updatedCart);

    return this.getHydratedCart();
  }

  static async removeItem(
    productId: string,
    unit: CartUnit,
  ): Promise<HydratedCart> {
    const cart = await this.getCart();

    const updatedCart = removeCartItem(cart, productId, unit);

    await this.saveCart(updatedCart);

    return this.getHydratedCart();
  }

  static async clear(): Promise<HydratedCart> {
    await this.saveCart(clearCart());

    return this.getHydratedCart();
  }

  static async getHydratedCart(): Promise<HydratedCart> {
    const cart = await this.getCart();

    if (!cart.items.length) {
      return this.emptyCart();
    }

    const ids = [...new Set(cart.items.map((item) => item.productId))];

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },

      select: {
        id: true,
        title: true,
        image: true,
        price: true,
        discountPrice: true,
        unit: true,
      },
    });

    const map = new Map(products.map((p) => [p.id, p]));

    const items: CartItemWithProduct[] = [];

    for (const item of cart.items) {
      const product = map.get(item.productId);

      if (!product) {
        continue;
      }

      const price =
        product.discountPrice !== null && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      items.push({
        ...item,

        product: {
          ...product,
          unit: product.unit as CartUnit,
        },

        price,

        total: price * item.qty,
      });
    }

    if (!items.length) {
      return this.emptyCart();
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0,
    );

    const discount = items.reduce(
      (sum, item) => sum + (item.product.price - item.price) * item.qty,
      0,
    );

    const deliveryFee = CART_DELIVERY_FEE;

    return {
      items,

      subtotal,

      discount,

      deliveryFee,

      total: subtotal - discount + deliveryFee,

      itemCount: items.length,

      quantity: items.reduce((sum, item) => sum + item.qty, 0),
    };
  }

  private static emptyCart(): HydratedCart {
    return {
      items: [],

      subtotal: 0,

      discount: 0,

      deliveryFee: 0,

      total: 0,

      itemCount: 0,

      quantity: 0,
    };
  }

  private static validateQuantity(qty: number, unit: CartUnit) {
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error("الكمية غير صحيحة");
    }

    if (unit === "PIECE" && !Number.isInteger(qty)) {
      throw new Error("الكمية يجب أن تكون رقم صحيح");
    }

    if (unit === "KG" && qty % 0.5 !== 0) {
      throw new Error("الكمية يجب أن تكون نصف كيلو");
    }
  }
}
