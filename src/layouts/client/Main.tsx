import { ReactNode } from "react";

import { DialogProvider } from "@/components/dialog";
import { CartProvider } from "@/lib/cart/provider";
import { CartService } from "@/lib/cart/service";
import { FavoritesProvider } from "@/lib/favorites/provider";
import { FavoritesService } from "@/lib/favorites/service";

import Wrapper from "./Wrapper";

const LayoutClient = async ({ children }: { children: ReactNode }) => {
  const [cart, favorites] = await Promise.all([
    CartService.getHydratedCart(),
    FavoritesService.getHydratedFavorites(),
  ]);

  return (
    <CartProvider initialCart={cart}>
      <FavoritesProvider initialFavorites={favorites}>
        <DialogProvider>
          <Wrapper>{children}</Wrapper>
        </DialogProvider>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default LayoutClient;
