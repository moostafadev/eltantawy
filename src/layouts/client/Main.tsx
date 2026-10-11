import { ReactNode } from "react";

import { DialogProvider } from "@/components/dialog";
import { CartProvider } from "@/lib/cart/provider";

import Wrapper from "./Wrapper";

const LayoutClient = ({ children }: { children: ReactNode }) => {
  return (
    <CartProvider>
      <DialogProvider>
        <Wrapper>{children}</Wrapper>
      </DialogProvider>
    </CartProvider>
  );
};

export default LayoutClient;
