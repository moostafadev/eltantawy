"use client";

import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

import { BreadcrumbProps } from "./types";
import { usePathname } from "next/navigation";

const Breadcrumb = ({ items, className = "" }: BreadcrumbProps) => {
  const pathName = usePathname();
  return (
    <nav
      aria-label="مسار التنقل"
      className={`w-full overflow-hidden ${className}`}
    >
      <ol className="flex min-w-0 items-center gap-1.5 text-sm sm:gap-2">
        {/* Home */}
        <li className="flex shrink-0 items-center">
          <Link
            href={pathName.startsWith("/admin") ? "/admin" : "/"}
            aria-label="الرئيسية"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background-second/30 hover:text-main sm:size-9"
          >
            <Home className="size-4 sm:size-4.5" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={index}
              className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2"
            >
              <ChevronLeft className="size-4 shrink-0 text-muted-foreground/50" />

              {isLast ? (
                <span className="flex min-w-0 max-w-36 items-center gap-1.5 truncate font-semibold text-foreground sm:max-w-60">
                  {item.icon && <span className="shrink-0">{item.icon}</span>}

                  <span className="truncate">{item.label}</span>
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="flex min-w-0 max-w-28 items-center gap-1.5 truncate text-muted-foreground transition-colors hover:text-main sm:max-w-48"
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}

                  <span className="truncate">{item.label}</span>
                </Link>
              ) : (
                <span className="flex min-w-0 max-w-28 items-center gap-1.5 truncate text-muted-foreground sm:max-w-48">
                  {item.icon && <span className="shrink-0">{item.icon}</span>}

                  <span className="truncate">{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
