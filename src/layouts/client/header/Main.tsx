// layouts/client/header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";

interface HeaderProps {
  isScrolled: boolean;
}

const navLinks = [
  { href: "/top-selling", label: "الأكثر مبيعًا" },
  { href: "/categories", label: "التصنيفات" },
  { href: "/offers", label: "العروض" },
];

const Header = ({ isScrolled }: HeaderProps) => {
  const pathname = usePathname();
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
        className={`fixed top-0 z-50 flex w-full justify-center bg-background transition-[height,box-shadow] duration-300 ${
          isScrolled ? "h-16 shadow-sm" : "h-20"
        }`}
      >
        <div className="container flex h-full items-center justify-between gap-3 py-1">
          <Link href="/" className="flex h-full items-center">
            <Image
              src="/logo.png"
              alt="الطنطاوي"
              width={200}
              height={200}
              priority
              className={`w-auto object-contain transition-[height] duration-300 ${
                isScrolled ? "h-14" : "h-18"
              }`}
            />
          </Link>

          <nav aria-label="القائمة الرئيسية">
            <ul className="hidden items-center gap-6 text-lg lg:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className={`transition-colors ${
                      pathname === link.href
                        ? "text-main"
                        : "text-foreground/80 hover:text-main"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/cart"
              aria-label="السلة"
              className="-m-2.5 flex h-11 w-11 items-center justify-center"
            >
              <ShoppingCart
                className="text-foreground"
                size={22}
                strokeWidth={1.75}
              />
            </Link>

            <button
              type="button"
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="-m-2.5 flex h-11 w-11 items-center justify-center lg:hidden"
            >
              {isMenuOpen ? (
                <X className="text-foreground" size={24} strokeWidth={1.75} />
              ) : (
                <Menu
                  className="text-foreground"
                  size={24}
                  strokeWidth={1.75}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* خلفية معتمة تقفل القايمة لو اتضغطت */}
      <div
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* قائمة الموبايل */}
      <nav
        aria-label="القائمة الرئيسية للموبايل"
        className={`fixed inset-x-0 top-16 z-40 bg-background shadow-lg transition-[transform,opacity] duration-300 lg:hidden ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4 text-lg">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`block py-3 ${
                  pathname === link.href ? "text-main" : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Header;
