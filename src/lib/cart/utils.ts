import { Cart, CartItem, CartUnit } from "./types";

export const EMPTY_CART = (): Cart => ({
  items: [],
});

export const getCartItemKey = (productId: string, unit: CartUnit) => {
  return `${productId}-${unit}`;
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

    return {
      items: parsed.items.filter(isValidCartItem),
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

export const addCartItem = (cart: Cart, item: CartItem): Cart => {
  const exists = cart.items.find(
    (current) =>
      current.productId === item.productId && current.unit === item.unit,
  );

  if (!exists) {
    return {
      items: [...cart.items, item],
    };
  }

  return {
    items: cart.items.map((current) => {
      if (current.productId === item.productId && current.unit === item.unit) {
        return {
          ...current,

          qty: current.qty + item.qty,
        };
      }

      return current;
    }),
  };
};

export const updateCartItem = (
  cart: Cart,
  productId: string,
  unit: CartUnit,
  qty: number,
): Cart => {
  return {
    items: cart.items.map((item) => {
      if (item.productId === productId && item.unit === unit) {
        return {
          ...item,
          qty,
        };
      }

      return item;
    }),
  };
};

export const removeCartItem = (
  cart: Cart,
  productId: string,
  unit: CartUnit,
): Cart => {
  return {
    items: cart.items.filter(
      (item) => !(item.productId === productId && item.unit === unit),
    ),
  };
};

export const clearCart = (): Cart => EMPTY_CART();
