import { Cart, CartItem, CartUnit } from "./types";

export const EMPTY_CART = (): Cart => ({
  items: [],
});

export const getCartItemKey = (
  productId: string,
  unit: CartUnit,
  weightOptionId?: string,
) => {
  return weightOptionId
    ? `${productId}-${unit}-${weightOptionId}`
    : `${productId}-${unit}`;
};

export const parseCart = (value?: string): Cart => {
  if (!value) {
    return EMPTY_CART();
  }

  try {
    const parsed = JSON.parse(value);

    if (!parsed || !Array.isArray(parsed.items)) {
      return EMPTY_CART();
    }

    const couponCode =
      typeof parsed.couponCode === "string" && parsed.couponCode.length > 0
        ? parsed.couponCode
        : undefined;

    return {
      items: parsed.items.filter(isValidCartItem),
      ...(couponCode ? { couponCode } : {}),
    };
  } catch {
    return EMPTY_CART();
  }
};

const isValidCartItem = (item: unknown): item is CartItem => {
  if (!item || typeof item !== "object") {
    return false;
  }

  const value = item as Record<string, unknown>;

  if (
    typeof value.productId !== "string" ||
    value.productId.length === 0 ||
    typeof value.qty !== "number" ||
    !Number.isFinite(value.qty) ||
    value.qty <= 0 ||
    (value.unit !== "KG" && value.unit !== "PIECE")
  ) {
    return false;
  }

  if (
    value.weightOptionId !== undefined &&
    (typeof value.weightOptionId !== "string" ||
      value.weightOptionId.length === 0)
  ) {
    return false;
  }

  // منتجات نطاق الوزن: qty تمثل عدد العبوات، لازم رقم صحيح موجب
  if (value.weightOptionId) {
    return Number.isInteger(value.qty);
  }

  if (value.unit === "PIECE" && !Number.isInteger(value.qty)) {
    return false;
  }

  if (value.unit === "KG" && value.qty % 0.5 !== 0) {
    return false;
  }

  return true;
};

export const serializeCart = (cart: Cart) => {
  return JSON.stringify(cart);
};

const isSameItem = (
  current: CartItem,
  productId: string,
  unit: CartUnit,
  weightOptionId?: string,
) => {
  return (
    current.productId === productId &&
    current.unit === unit &&
    current.weightOptionId === weightOptionId
  );
};

export const addCartItem = (cart: Cart, item: CartItem): Cart => {
  const exists = cart.items.find((current) =>
    isSameItem(current, item.productId, item.unit, item.weightOptionId),
  );

  if (!exists) {
    return {
      items: [...cart.items, item],
      ...(cart.couponCode ? { couponCode: cart.couponCode } : {}),
    };
  }

  return {
    items: cart.items.map((current) => {
      if (isSameItem(current, item.productId, item.unit, item.weightOptionId)) {
        return {
          ...current,

          qty: current.qty + item.qty,
        };
      }

      return current;
    }),
    ...(cart.couponCode ? { couponCode: cart.couponCode } : {}),
  };
};

export const updateCartItem = (
  cart: Cart,
  productId: string,
  unit: CartUnit,
  qty: number,
  weightOptionId?: string,
): Cart => {
  return {
    items: cart.items.map((item) => {
      if (isSameItem(item, productId, unit, weightOptionId)) {
        return {
          ...item,
          qty,
        };
      }

      return item;
    }),
    ...(cart.couponCode ? { couponCode: cart.couponCode } : {}),
  };
};

export const removeCartItem = (
  cart: Cart,
  productId: string,
  unit: CartUnit,
  weightOptionId?: string,
): Cart => {
  return {
    items: cart.items.filter(
      (item) => !isSameItem(item, productId, unit, weightOptionId),
    ),
    ...(cart.couponCode ? { couponCode: cart.couponCode } : {}),
  };
};

export const clearCart = (): Cart => EMPTY_CART();

/**
 * تخزين كود الكوبون على السلة (بيتم استبدال أي كود قديم)
 */
export const setCouponCode = (cart: Cart, code: string): Cart => {
  return {
    items: cart.items,
    couponCode: code,
  };
};

/**
 * إلغاء الكوبون المطبق حاليًا على السلة
 */
export const removeCouponCode = (cart: Cart): Cart => {
  return {
    items: cart.items,
  };
};
