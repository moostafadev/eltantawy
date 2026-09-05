import { cookies } from "next/headers";

import { prisma } from "../prisma";
import { verifyAccessToken } from "../auth";

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
  removeCouponCode,
  serializeCart,
  setCouponCode,
  updateCartItem,
} from "./utils";

import {
  Cart,
  CartItemWithProduct,
  CartUnit,
  DiscountSource,
  HydratedCart,
} from "./types";

interface DiscountEvaluationSuccess {
  ok: true;
  amount: number;
}

interface DiscountEvaluationFailure {
  ok: false;
  message: string;
}

type DiscountRecord = {
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  usageLimit: number | null;
  usageCount: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  valueType: string;
  value: number;
};

const AUTO_DISCOUNT_LABELS: Record<
  "ALL_CUSTOMERS" | "REGISTERED_ONLY",
  string
> = {
  ALL_CUSTOMERS: "خصم على كل الطلبات",
  REGISTERED_ONLY: "خصم لأعضاء الموقع",
};

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

  /**
   * جلب بيانات المستخدم الحالي (لو مسجل دخول) من access_token
   * بدون أي redirect، فقط للاستخدام الداخلي في تقييم الخصومات
   */
  private static async getCurrentUser(): Promise<{
    id: string;
    isVerified: boolean;
  } | null> {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null;
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return null;
    }

    return prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        isVerified: true,
      },
    });
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

  /**
   * تطبيق كود خصم (كوبون) على السلة الحالية.
   *
   * ملاحظة: مفيش زيادة في usageCount هنا، ده بيحصل فقط وقت
   * إنشاء الطلب فعليًا (هيتضاف مع نظام الـ Orders).
   */
  static async applyCoupon(
    rawCode: string,
  ): Promise<{ success: boolean; message: string; cart?: HydratedCart }> {
    const normalizedCode = rawCode.trim().toUpperCase();

    if (!normalizedCode) {
      return {
        success: false,
        message: "يرجى إدخال كود الخصم",
      };
    }

    const discount = await prisma.discount.findFirst({
      where: {
        code: normalizedCode,
        type: "COUPON",
      },
    });

    if (!discount) {
      return {
        success: false,
        message: "كود الخصم غير صحيح",
      };
    }

    const hydrated = await this.getHydratedCart();

    if (!hydrated.items.length) {
      return {
        success: false,
        message: "السلة فارغة",
      };
    }

    const productsTotal = hydrated.subtotal - hydrated.discount;

    const evaluation = this.evaluateDiscount(discount, productsTotal);

    if (!evaluation.ok) {
      return {
        success: false,
        message: evaluation.message,
      };
    }

    const cart = await this.getCart();

    await this.saveCart(setCouponCode(cart, normalizedCode));

    const updatedCart = await this.getHydratedCart();

    return {
      success: true,
      message: "تم تطبيق كود الخصم بنجاح",
      cart: updatedCart,
    };
  }

  /**
   * إلغاء الكوبون المطبق حاليًا على السلة
   */
  static async removeCoupon(): Promise<HydratedCart> {
    const cart = await this.getCart();

    await this.saveCart(removeCouponCode(cart));

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

    const productsTotal = subtotal - discount;

    /*
     * ================================
     * 1) الكوبون المُدخل (لو موجود)
     * ================================
     */
    let couponCode: string | null = null;
    let couponDiscountAmount = 0;

    if (cart.couponCode) {
      const couponRecord = await prisma.discount.findFirst({
        where: {
          code: cart.couponCode,
          type: "COUPON",
        },
      });

      if (couponRecord) {
        const evaluation = this.evaluateDiscount(couponRecord, productsTotal);

        if (evaluation.ok) {
          couponCode = cart.couponCode;
          couponDiscountAmount = evaluation.amount;
        }
      }
    }

    /*
     * ================================
     * 2) أفضل خصم تلقائي متاح
     *    (لكل العملاء + للمسجلين الموثقين فقط)
     * ================================
     */
    const currentUser = await this.getCurrentUser();

    const autoTypes: ("ALL_CUSTOMERS" | "REGISTERED_ONLY")[] = [
      "ALL_CUSTOMERS",
    ];

    if (currentUser?.isVerified) {
      autoTypes.push("REGISTERED_ONLY");
    }

    const autoDiscountRecords = await prisma.discount.findMany({
      where: {
        type: {
          in: autoTypes,
        },
        isActive: true,
      },
    });

    let autoDiscountAmount = 0;
    let autoDiscountType: "ALL_CUSTOMERS" | "REGISTERED_ONLY" | null = null;

    for (const record of autoDiscountRecords) {
      const evaluation = this.evaluateDiscount(record, productsTotal);

      if (evaluation.ok && evaluation.amount > autoDiscountAmount) {
        autoDiscountAmount = evaluation.amount;
        autoDiscountType = record.type as "ALL_CUSTOMERS" | "REGISTERED_ONLY";
      }
    }

    const autoDiscountLabel = autoDiscountType
      ? AUTO_DISCOUNT_LABELS[autoDiscountType]
      : null;

    /*
     * ================================
     * 3) اختيار الخصم الفعلي المطبق: الأعلى قيمة بين
     *    الكوبون والخصم التلقائي (بدون تراكم بينهم)
     * ================================
     */
    let discountAmount = 0;
    let appliedDiscountSource: DiscountSource | null = null;
    let appliedDiscountLabel: string | null = null;

    if (
      couponDiscountAmount >= autoDiscountAmount &&
      couponDiscountAmount > 0
    ) {
      discountAmount = couponDiscountAmount;
      appliedDiscountSource = "COUPON";
      appliedDiscountLabel = `كود الخصم (${couponCode})`;
    } else if (autoDiscountAmount > 0) {
      discountAmount = autoDiscountAmount;
      appliedDiscountSource = autoDiscountType;
      appliedDiscountLabel = autoDiscountLabel;
    }

    return {
      items,

      subtotal,

      discount,

      deliveryFee,

      total: subtotal - discount - discountAmount + deliveryFee,

      itemCount: items.length,

      quantity: items.reduce((sum, item) => sum + item.qty, 0),

      hasApproxItems,

      minTotal: minTotal + deliveryFee - discountAmount,

      maxTotal: maxTotal + deliveryFee - discountAmount,

      couponCode,

      couponDiscountAmount,

      autoDiscountAmount,

      autoDiscountLabel,

      discountAmount,

      appliedDiscountSource,

      appliedDiscountLabel,
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

  /**
   * التحقق من صلاحية أي خصم (كوبون أو تلقائي) وحساب قيمته.
   *
   * قواعد الرفض بالترتيب: غير مفعّل → لم يبدأ بعد → منتهي الصلاحية →
   * تم استنفاد عدد مرات الاستخدام → أقل من الحد الأدنى للطلب →
   * قيمة الخصم أكبر من قيمة السلة.
   */
  private static evaluateDiscount(
    discount: DiscountRecord,
    productsTotal: number,
  ): DiscountEvaluationSuccess | DiscountEvaluationFailure {
    if (!discount.isActive) {
      return {
        ok: false,
        message: "هذا الخصم غير مفعل حاليًا",
      };
    }

    const now = new Date();

    if (discount.startDate && now < discount.startDate) {
      return {
        ok: false,
        message: "لم يبدأ العمل بهذا الخصم بعد",
      };
    }

    if (discount.endDate && now > discount.endDate) {
      return {
        ok: false,
        message: "انتهت صلاحية هذا الخصم",
      };
    }

    if (
      discount.usageLimit !== null &&
      discount.usageCount >= discount.usageLimit
    ) {
      return {
        ok: false,
        message: "تم الوصول للحد الأقصى لاستخدام هذا الخصم",
      };
    }

    if (
      discount.minOrderAmount !== null &&
      productsTotal < discount.minOrderAmount
    ) {
      return {
        ok: false,
        message: `الحد الأدنى لتطبيق هذا الخصم هو ${discount.minOrderAmount} ج.م`,
      };
    }

    let amount =
      discount.valueType === "PERCENTAGE"
        ? (productsTotal * discount.value) / 100
        : discount.value;

    if (
      discount.valueType === "PERCENTAGE" &&
      discount.maxDiscountAmount !== null
    ) {
      amount = Math.min(amount, discount.maxDiscountAmount);
    }

    if (amount > productsTotal) {
      return {
        ok: false,
        message: "قيمة الخصم أكبر من قيمة السلة، لا يمكن تطبيق هذا الخصم",
      };
    }

    return {
      ok: true,
      amount,
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

      hasApproxItems: false,

      minTotal: 0,

      maxTotal: 0,

      couponCode: null,

      couponDiscountAmount: 0,

      autoDiscountAmount: 0,

      autoDiscountLabel: null,

      discountAmount: 0,

      appliedDiscountSource: null,

      appliedDiscountLabel: null,
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
