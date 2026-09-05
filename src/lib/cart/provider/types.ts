import { CartUnit, CartItemWithProduct, HydratedCart } from "../types";

export interface CartProviderProps {
  children: React.ReactNode;
  initialCart: HydratedCart;
}

export interface ApplyCouponResult {
  success: boolean;
  message: string;
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
    weightOptionId?: string;
  }): Promise<void>;

  updateItem(
    productId: string,
    unit: CartUnit,
    qty: number,
    weightOptionId?: string,
  ): Promise<void>;

  removeItem(
    productId: string,
    unit: CartUnit,
    weightOptionId?: string,
  ): Promise<void>;

  isApplyingCoupon: boolean;

  applyCoupon(code: string): Promise<ApplyCouponResult>;

  removeCoupon(): Promise<void>;
}
