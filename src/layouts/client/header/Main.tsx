"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, UserRound } from "lucide-react";
import { ButtonMobile, NavbarMobile } from "./mobile";
import Navbar from "./Navbar";

interface HeaderProps {
  isScrolled: boolean;
}

const Header = ({ isScrolled }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed bottom-0 lg:top-0 border-t border-t-background-second/20 lg:border-b lg:border-b-background-second/20 z-50 flex w-full justify-center bg-background transition-[height,box-shadow] duration-300 ${
          isScrolled ? "h-16 shadow-sm" : "h-20"
        }`}
      >
        <div className="container flex h-full items-center justify-between gap-3">
          <Link
            href="/"
            className="flex h-full items-center py-1"
            onClick={() => setIsMenuOpen(false)}
          >
            <Image
              src="/logo-2.png"
              alt="الطنطاوي"
              width={200}
              height={200}
              priority
              className={`w-auto object-contain transition-[height] duration-300 ${
                isScrolled ? "h-14" : "h-18"
              }`}
            />
          </Link>

          <Navbar />

          <div className="flex items-center gap-2">
            <Link
              href="/register"
              className="-m-2.5 flex h-11 w-11 items-center justify-center"
            >
              <UserRound
                className="text-foreground"
                size={22}
                strokeWidth={1.75}
              />
            </Link>

            <Link
              href="/cart"
              className="-m-2.5 flex h-11 w-11 items-center justify-center"
            >
              <ShoppingCart
                className="text-foreground"
                size={22}
                strokeWidth={1.75}
              />
            </Link>

            <ButtonMobile isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
          </div>
        </div>
      </header>

      <NavbarMobile isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  );
};

export default Header;
