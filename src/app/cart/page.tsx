import { ShoppingCart } from "lucide-react";

import { CartService } from "@/lib/cart/service";

import { CartItem, CartSummary } from "@/features/client/cart";
import { CartProvider } from "@/lib/cart/provider";

const CartPage = async () => {
  const cart = await CartService.getHydratedCart();

  return (
    <CartProvider initialCart={cart}>
      <main className="container py-6 lg:py-8">
        <div className="flex flex-col gap-3 lg:gap-4">
          <header>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex size-10 items-center justify-center bg-main/10 text-main">
                <ShoppingCart className="size-5" />
              </div>

              <div className="flex flex-col gap-0.5 lg:gap-1">
                <h1 className="text-xl font-bold lg:text-2xl">سلة التسوق</h1>

                <p className="text-sm text-muted-foreground">
                  {cart.itemCount.toLocaleString("ar-EG")}{" "}
                  {cart.itemCount === 1 ? "منتج" : "منتجات"}
                </p>
              </div>
            </div>
          </header>

          {cart.items.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-border px-3 text-center lg:px-4">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ShoppingCart className="size-7" />
              </div>

              <h2 className="text-lg font-bold">السلة فارغة</h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                لم تقم بإضافة أي منتجات إلى السلة بعد.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-4">
              <section className="border border-border bg-background px-3 lg:px-4">
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
      </main>
    </CartProvider>
  );
};

export default CartPage;
