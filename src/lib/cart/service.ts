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

    weightOptionId?: string;
  }): Promise<HydratedCart> {
    const product = await prisma.product.findUnique({
      where: {
        id: data.productId,
      },

      select: {
        id: true,
        unit: true,
        saleType: true,
        weightOptions: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error("المنتج غير موجود");
    }

    if (product.unit !== data.unit) {
      throw new Error("وحدة المنتج غير صحيحة");
    }

    this.validateWeightOption(product, data.weightOptionId);

    this.validateQuantity(data.qty, data.unit, Boolean(data.weightOptionId));

    const cart = await this.getCart();

    const updatedCart = addCartItem(cart, data);

    await this.saveCart(updatedCart);

    return this.getHydratedCart();
  }

  static async updateItem(data: {
    productId: string;

    unit: CartUnit;

    qty: number;

    weightOptionId?: string;
  }): Promise<HydratedCart> {
    this.validateQuantity(data.qty, data.unit, Boolean(data.weightOptionId));

    const cart = await this.getCart();

    const exists = cart.items.some(
      (item) =>
        item.productId === data.productId &&
        item.unit === data.unit &&
        item.weightOptionId === data.weightOptionId,
    );

    if (!exists) {
      throw new Error("المنتج غير موجود في السلة");
    }

    const updatedCart = updateCartItem(
      cart,
      data.productId,
      data.unit,
      data.qty,
      data.weightOptionId,
    );

    await this.saveCart(updatedCart);

    return this.getHydratedCart();
  }

  static async removeItem(
    productId: string,
    unit: CartUnit,
    weightOptionId?: string,
  ): Promise<HydratedCart> {
    const cart = await this.getCart();

    const updatedCart = removeCartItem(cart, productId, unit, weightOptionId);

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
        saleType: true,
        weightOptions: {
          select: {
            id: true,
            name: true,
            minWeight: true,
            maxWeight: true,
          },
        },
      },
    });

    const map = new Map(products.map((p) => [p.id, p]));

    const items: CartItemWithProduct[] = [];

    for (const item of cart.items) {
      const product = map.get(item.productId);

      if (!product) {
        continue;
      }

      const unitPrice =
        product.discountPrice !== null && product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      const weightOption = item.weightOptionId
        ? product.weightOptions.find(
            (option) => option.id === item.weightOptionId,
          )
        : undefined;

      const isApprox =
        product.saleType === "WEIGHT_RANGE" && Boolean(weightOption);

      const baseProduct = {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        discountPrice: product.discountPrice,
        unit: product.unit as CartUnit,
        saleType: product.saleType,
      };

      if (isApprox && weightOption) {
        const avgWeight = (weightOption.minWeight + weightOption.maxWeight) / 2;

        const minTotal = unitPrice * weightOption.minWeight * item.qty;
        const maxTotal = unitPrice * weightOption.maxWeight * item.qty;
        const avgTotal = unitPrice * avgWeight * item.qty;

        items.push({
          ...item,

          product: baseProduct,

          price: unitPrice,

          total: avgTotal,

          isApprox: true,

          weightOption,

          minTotal,

          maxTotal,
        });
      } else {
        const total = unitPrice * item.qty;

        items.push({
          ...item,

          product: baseProduct,

          price: unitPrice,

          total,

          isApprox: false,
        });
      }
    }

    if (!items.length) {
      return this.emptyCart();
    }

    const subtotal = items.reduce(
      (sum, item) =>
        sum + item.product.price * item.qty * this.weightMultiplier(item),
      0,
    );

    const discount = items.reduce(
      (sum, item) =>
        sum +
        (item.product.price - item.price) *
          item.qty *
          this.weightMultiplier(item),
      0,
    );

    const minTotal = items.reduce(
      (sum, item) => sum + (item.isApprox ? item.minTotal! : item.total),
      0,
    );

    const maxTotal = items.reduce(
      (sum, item) => sum + (item.isApprox ? item.maxTotal! : item.total),
      0,
    );

    const deliveryFee = CART_DELIVERY_FEE;

    const hasApproxItems = items.some((item) => item.isApprox);

    return {
      items,

      subtotal,

      discount,

      deliveryFee,

      total: subtotal - discount + deliveryFee,

      itemCount: items.length,

      quantity: items.reduce((sum, item) => sum + item.qty, 0),

      hasApproxItems,

      minTotal: minTotal + deliveryFee,

      maxTotal: maxTotal + deliveryFee,
    };
  }

  /**
   * لعناصر نطاق الوزن: بنستخدم متوسط الوزن كمضاعف لحساب الـ subtotal/discount
   * لعناصر البيع العادي: المضاعف 1 (بدون تأثير)
   */
  private static weightMultiplier(item: CartItemWithProduct) {
    if (!item.isApprox || !item.weightOption) {
      return 1;
    }

    return (item.weightOption.minWeight + item.weightOption.maxWeight) / 2;
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

      hasApproxItems: false,

      minTotal: 0,

      maxTotal: 0,
    };
  }

  private static validateWeightOption(
    product: { saleType: string; weightOptions: { id: string }[] },
    weightOptionId?: string,
  ) {
    if (product.saleType === "WEIGHT_RANGE") {
      if (!weightOptionId) {
        throw new Error("يجب اختيار خيار الوزن");
      }

      const exists = product.weightOptions.some(
        (option) => option.id === weightOptionId,
      );

      if (!exists) {
        throw new Error("خيار الوزن غير صحيح");
      }
    }
  }

  private static validateQuantity(
    qty: number,
    unit: CartUnit,
    isWeightRange: boolean,
  ) {
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error("الكمية غير صحيحة");
    }

    if (isWeightRange) {
      if (!Number.isInteger(qty)) {
        throw new Error("عدد العبوات يجب أن يكون رقم صحيح");
      }

      return;
    }

    if (unit === "PIECE" && !Number.isInteger(qty)) {
      throw new Error("الكمية يجب أن تكون رقم صحيح");
    }

    if (unit === "KG" && qty % 0.5 !== 0) {
      throw new Error("الكمية يجب أن تكون نصف كيلو");
    }
  }
}
