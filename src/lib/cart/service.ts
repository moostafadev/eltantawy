import { cookies } from "next/headers";

import { prisma } from "../prisma";

import { CART_COOKIE_NAME, CART_COOKIE_OPTIONS } from "./constants";

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
  }) {
    const { productId, qty, unit } = data;

    this.validateQuantity(qty, unit);

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        unit: true,
      },
    });

    if (!product) {
      throw new Error("المنتج غير موجود");
    }

    if (product.unit !== unit) {
      throw new Error("وحدة المنتج غير صحيحة");
    }

    const cart = await this.getCart();

    const updatedCart = addCartItem(cart, {
      productId,
      qty,
      unit,
    });

    await this.saveCart(updatedCart);

    return updatedCart;
  }

  static async updateItem(data: { productId: string; qty: number }) {
    const cart = await this.getCart();

    const item = cart.items.find(
      (cartItem) => cartItem.productId === data.productId,
    );

    if (!item) {
      throw new Error("المنتج غير موجود في السلة");
    }

    this.validateQuantity(data.qty, item.unit);

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

    if (product.unit !== item.unit) {
      throw new Error("وحدة المنتج تغيرت");
    }

    const updatedCart = updateCartItem(cart, data.productId, data.qty);

    await this.saveCart(updatedCart);

    return updatedCart;
  }

  static async removeItem(productId: string) {
    const cart = await this.getCart();

    const updatedCart = removeCartItem(cart, productId);

    await this.saveCart(updatedCart);

    return updatedCart;
  }

  static async clear() {
    const updatedCart = clearCart();

    await this.saveCart(updatedCart);

    return updatedCart;
  }

  static async getHydratedCart(): Promise<HydratedCart> {
    const cart = await this.getCart();

    if (!cart.items.length) {
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

    const productIds = [...new Set(cart.items.map((item) => item.productId))];

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
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

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    const items: CartItemWithProduct[] = [];

    for (const cartItem of cart.items) {
      const product = productMap.get(cartItem.productId);

      if (!product) {
        continue;
      }

      if (product.unit !== cartItem.unit) {
        continue;
      }

      const price =
        product.discountPrice !== null && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      items.push({
        ...cartItem,
        product: {
          ...product,
          unit: product.unit as CartUnit,
        },
        price,
        total: price * cartItem.qty,
      });
    }

    /*
     * If products were deleted or their units changed,
     * they will not be included in the hydrated cart.
     */

    if (!items.length) {
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

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0,
    );

    const discount = items.reduce(
      (sum, item) => sum + (item.product.price - item.price) * item.qty,
      0,
    );

    const deliveryFee = 50;

    const total = subtotal - discount + deliveryFee;

    const itemCount = items.length;

    const quantity = items.reduce((sum, item) => sum + item.qty, 0);

    return {
      items,
      subtotal,
      discount,
      deliveryFee,
      total,
      itemCount,
      quantity,
    };
  }

  private static validateQuantity(qty: number, unit: CartUnit) {
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error("الكمية غير صالحة");
    }

    if (unit === "PIECE" && !Number.isInteger(qty)) {
      throw new Error("كمية المنتج يجب أن تكون رقمًا صحيحًا");
    }

    if (unit === "KG" && qty % 0.5 !== 0) {
      throw new Error("كمية المنتج يجب أن تكون بمضاعفات نصف كيلو");
    }
  }
}
