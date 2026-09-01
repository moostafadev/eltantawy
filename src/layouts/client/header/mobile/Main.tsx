"use client";

import { navLinks } from "../constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IProps } from "../types";

const NavbarMobile = ({ isOpen, setIsOpen }: IProps) => {
  const pathname = usePathname();

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed w-full top-0 z-30 bg-black/40 duration-300 lg:hidden ${
          isOpen ? "opacity-100 h-[calc(100%-5rem)]" : "opacity-0 h-0"
        }`}
      />
      <nav
        className={`fixed w-full z-40 bg-background shadow-lg duration-300 lg:hidden ${
          isOpen ? "bottom-20" : "-bottom-full"
        }`}
      >
        <ul className="flex flex-col gap-1 px-3 py-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 py-2 ${
                  pathname === link.href ? "text-main" : "text-foreground/80"
                }`}
              >
                <link.icon />
                <p>{link.label}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default NavbarMobile;
