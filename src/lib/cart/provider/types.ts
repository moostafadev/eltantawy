import { CartUnit, CartItemWithProduct, HydratedCart } from "../types";

export interface CartProviderProps {
  children: React.ReactNode;
  initialCart: HydratedCart;
}

export interface CartContextValue {
  cart: HydratedCart;

  items: CartItemWithProduct[];

  syncCart(cart: HydratedCart): void;

  isUpdating: boolean;

  updatingItems: Record<string, boolean>;

  isItemUpdating(key: string): boolean;

  addItem(data: {
    productId: string;
    qty: number;
    unit: CartUnit;
  }): Promise<void>;

  updateItem(productId: string, unit: CartUnit, qty: number): Promise<void>;

  removeItem(productId: string, unit: CartUnit): Promise<void>;
}
