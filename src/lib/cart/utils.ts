import { Cart, CartItem } from "./types";

export const EMPTY_CART: Cart = {
  items: [],
};

export const parseCart = (value?: string): Cart => {
  if (!value) {
    return EMPTY_CART;
  }

  try {
    const parsed = JSON.parse(value);

    if (!parsed || !Array.isArray(parsed.items)) {
      return EMPTY_CART;
    }

    return {
      items: parsed.items.filter(isValidCartItem),
    };
  } catch {
    return EMPTY_CART;
  }
};

const isValidCartItem = (item: unknown): item is CartItem => {
  if (!item || typeof item !== "object") {
    return false;
  }

  const value = item as Record<string, unknown>;

  return (
    typeof value.productId === "string" &&
    value.productId.length > 0 &&
    typeof value.qty === "number" &&
    Number.isFinite(value.qty) &&
    value.qty > 0 &&
    (value.unit === "KG" || value.unit === "PIECE")
  );
};

export const serializeCart = (cart: Cart) => {
  return JSON.stringify(cart);
};

export const addCartItem = (cart: Cart, item: CartItem): Cart => {
  const existingItem = cart.items.find(
    (cartItem) =>
      cartItem.productId === item.productId && cartItem.unit === item.unit,
  );

  if (!existingItem) {
    return {
      items: [...cart.items, item],
    };
  }

  return {
    items: cart.items.map((cartItem) =>
      cartItem.productId === item.productId && cartItem.unit === item.unit
        ? {
            ...cartItem,
            qty: cartItem.qty + item.qty,
          }
        : cartItem,
    ),
  };
};

export const updateCartItem = (
  cart: Cart,
  productId: string,
  qty: number,
): Cart => {
  if (qty <= 0) {
    return removeCartItem(cart, productId);
  }

  return {
    items: cart.items.map((item) =>
      item.productId === productId
        ? {
            ...item,
            qty,
          }
        : item,
    ),
  };
};

export const removeCartItem = (cart: Cart, productId: string): Cart => {
  return {
    items: cart.items.filter((item) => item.productId !== productId),
  };
};

export const clearCart = (): Cart => {
  return EMPTY_CART;
};
