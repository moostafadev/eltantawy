"use client";

import { ShoppingCart, Store } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/button";
import { CartItem, CartSummary } from "@/features/client/cart";

import { useCart } from "@/lib/cart/provider";

const CartPage = () => {
  const { cart } = useCart();

  return (
    <main className="flex flex-1 items-stretch py-6 lg:py-8 bg-background-second/20">
      <div className="container">
        <div className="flex flex-col gap-4">
          <header className="flex size-10 items-center justify-center bg-main/10 text-main">
            <ShoppingCart />
          </header>

          {cart.items.length === 0 ? (
            <div className="flex min-h-112 flex-col items-center justify-center px-4 text-center gap-3 lg:gap-4 bg-background">
              <div className="flex size-20 items-center justify-center bg-main/10 text-main lg:size-24">
                <ShoppingCart className="size-9 lg:size-11" strokeWidth={1.5} />
              </div>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-semibold text-foreground lg:text-xl">
                  السلة فارغة
                </h2>

                <p className="text-sm text-muted-foreground">
                  لسه مضفتش أي منتجات، تصفح المتجر وابدأ تسوقك دلوقتي
                </p>
              </div>

              <Link href="/">
                <Button color="MAIN" className="mt-1 gap-2">
                  <Store className="size-4" />
                  تصفح المنتجات
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 lg:gap-4 lg:grid-cols-[1fr_360px]">
              <section className="border border-border px-3 lg:px-4 bg-background h-fit">
                {cart.items.map((item) => (
                  <CartItem
                    key={`${item.productId}-${item.unit}`}
                    item={item}
                  />
                ))}
              </section>

              <CartSummary />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CartPage;
