"use client";

import Link from "next/link";
import { navLinks } from "./constants";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="h-full lg:flex items-center hidden">
      <ul className="items-center text-lg flex h-full">
        {navLinks.map((link) => (
          <li
            key={link.href}
            className={`px-4 h-full flex items-center relative before:absolute before:-bottom-px before:duration-300 before:right-0 before:h-0.5 before:w-0 hover:before:w-full before:bg-main`}
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
