"use client";

import { Heart, Store } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/button";
import { useFavorites } from "@/lib/favorites/provider";

import { ProductCard } from "../product-card";

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <main className="flex flex-1 items-stretch py-6 lg:py-8 bg-background-second/20">
      <div className="container">
        <div className="flex flex-col gap-4">
          <header className="flex size-10 items-center justify-center bg-main/10 text-main">
            <Heart />
          </header>

          {favorites.items.length === 0 ? (
            <div className="flex min-h-112 flex-col items-center justify-center px-4 text-center gap-3 lg:gap-4 bg-background">
              <div className="flex size-20 items-center justify-center bg-main/10 text-main lg:size-24">
                <Heart className="size-9 lg:size-11" strokeWidth={1.5} />
              </div>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-semibold text-foreground lg:text-xl">
                  المفضلة فارغة
                </h2>

                <p className="text-sm text-muted-foreground">
                  لسه مضفتش أي منتجات للمفضلة، تصفح المتجر وضيف اللي يعجبك
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
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {favorites.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Favorites;
