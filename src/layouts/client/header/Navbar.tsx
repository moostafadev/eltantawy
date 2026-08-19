"use client";

import Link from "next/link";
import { navLinks } from "./constants";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="h-full flex items-center">
      <ul className="hidden items-center text-lg lg:flex h-full">
        {navLinks.map((link) => (
          <li
            key={link.href}
            className={`px-6 h-full flex items-center relative before:absolute before:bottom-0 before:duration-300 before:right-0 before:h-0.5 before:w-0 hover:before:w-full before:bg-main ${pathname === link.href && "before:w-full"}`}
          >
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
  );
};

export default Navbar;
