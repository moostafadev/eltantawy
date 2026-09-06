import { BadgePercent, Store } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/button";
import { ProductCard } from "@/features/client/product-card";

import { getActiveAutoDiscount, getDiscountedProducts } from "./offers.service";
import OfferBanner from "./OfferBanner";

const Offers = async () => {
  const [discountedProducts, autoDiscount] = await Promise.all([
    getDiscountedProducts(),
    getActiveAutoDiscount(),
  ]);

  return (
    <main className="container flex flex-col gap-6 py-6 lg:gap-8 lg:py-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-12 items-center justify-center bg-main/10 text-main">
          <BadgePercent className="size-6" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          العروض والخصومات
        </h1>

        <p className="max-w-xl text-sm text-muted-foreground lg:text-base">
          أقوى العروض على أجود أنواع اللحوم والدواجن الطازجة، لفترة محدودة
        </p>
      </header>

      {autoDiscount && (
        <OfferBanner
          type={autoDiscount.type as "ALL_CUSTOMERS" | "REGISTERED_ONLY"}
          valueType={autoDiscount.valueType}
          value={autoDiscount.value}
          minOrderAmount={autoDiscount.minOrderAmount}
        />
      )}

      {discountedProducts.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center gap-3 border border-border bg-background p-6 text-center">
          <div className="flex size-12 items-center justify-center bg-muted text-muted-foreground">
            <BadgePercent className="size-6" />
          </div>

          <div>
            <h2 className="font-bold">لا توجد عروض حاليًا</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              تابعنا أولًا بأول، هنضيف عروض جديدة قريبًا
            </p>
          </div>

          <Link href="/products">
            <Button color="MAIN" className="mt-1 gap-2">
              <Store className="size-4" />
              تصفح كل المنتجات
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold lg:text-xl">
            منتجات عليها خصم مباشر ({discountedProducts.length})
          </h2>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Offers;
