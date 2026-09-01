"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CircleUserRound,
  ShoppingCart,
  UserRound,
  LoaderCircle,
} from "lucide-react";

import { ButtonMobile, NavbarMobile } from "./mobile";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/lib/cart/provider";
import { toArabicNums } from "@/utils/toArabicNums";

interface HeaderProps {
  isScrolled: boolean;
}

const Header = ({ isScrolled }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  const quantity = cart.itemCount;

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed bottom-0 lg:top-0 border-t border-t-background-second/20 lg:border-b lg:border-b-background-second/20 z-50 flex w-full justify-center bg-background transition-[height,box-shadow] duration-300 ${
          isScrolled
            ? "h-16 shadow-sm bg-background/50 backdrop-blur-sm"
            : "h-20"
        }`}
      >
        <div className="container flex h-full items-center justify-between gap-3">
          <ButtonMobile isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
          <Link
            href="/"
            className="flex h-full items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image
              src="/logo-2.png"
              alt="الطنطاوي"
              width={200}
              height={200}
              priority
              className={`w-auto object-contain transition-[height] duration-300 py-0.5 ${
                isScrolled ? "h-14" : "h-18"
              }`}
            />
          </Link>

          <Navbar />

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="-m-2.5 relative flex size-10 lg:size-11 items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart
                className="text-foreground transition-colors hover:text-main"
                size={22}
                strokeWidth={1.75}
              />

              {quantity > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-main px-0.5 text-[11px] font-bold text-white shadow-sm ring-2 ring-background animate-cart-badge">
                  {quantity > 99 ? toArabicNums("99+") : toArabicNums(quantity)}
                </span>
              )}
            </Link>
            {/* User */}
            {isAuthLoading ? (
              <div className="flex size-10 lg:size-11 items-center justify-center">
                <LoaderCircle
                  size={21}
                  strokeWidth={1.75}
                  className="animate-spin text-muted-foreground"
                />
              </div>
            ) : (
              <Link
                href={isAuthenticated ? "/profile" : "/login"}
                className="-m-2.5 flex size-10 lg:size-11 items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {isAuthenticated ? (
                  <CircleUserRound
                    className="text-foreground transition-colors hover:text-main"
                    size={22}
                    strokeWidth={1.75}
                  />
                ) : (
                  <UserRound
                    className="text-foreground transition-colors hover:text-main"
                    size={22}
                    strokeWidth={1.75}
                  />
                )}
              </Link>
            )}
          </div>
        </div>
      </header>

      <NavbarMobile isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  );
};

export default Header;
