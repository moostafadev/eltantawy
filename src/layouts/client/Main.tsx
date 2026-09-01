import { ReactNode } from "react";

import { DialogProvider } from "@/components/dialog";
import { CartProvider } from "@/lib/cart/provider";
import { CartService } from "@/lib/cart/service";

import Wrapper from "./Wrapper";

const LayoutClient = async ({ children }: { children: ReactNode }) => {
  const cart = await CartService.getHydratedCart();

  return (
    <CartProvider initialCart={cart}>
      <DialogProvider>
        <Wrapper>{children}</Wrapper>
      </DialogProvider>
    </CartProvider>
  );
};

export default LayoutClient;
