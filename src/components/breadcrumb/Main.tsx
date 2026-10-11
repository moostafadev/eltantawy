"use client";

import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

import { BreadcrumbProps } from "./types";
import { usePathname } from "next/navigation";
import { Tooltip } from "@/components/tooltip";

/**
 * Breadcrumb navigation trail.
 *
 * Renders a home icon followed by the given `items`. The last item is
 * rendered as bold, non-clickable text (the current page). Any other
 * item renders as a link when it has an `href`, otherwise as plain text.
 *
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: "Categories", href: "/admin/products/categories" },
 *     { label: "Create category" },
 *   ]}
 * />
 */
const Breadcrumb = ({ items, className = "" }: BreadcrumbProps) => {
  const pathName = usePathname();
  return (
    <nav
      aria-label="مسار التنقل"
      tabIndex={0}
      className={`scrollbar-hide w-full overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main ${className}`}
    >
      <ol className="flex w-max min-w-full flex-nowrap items-center gap-1.5 text-sm sm:gap-2">
        <li className="flex shrink-0 items-center">
          <Tooltip content="الرئيسية" focusable={false}>
            <Link
              href={pathName.startsWith("/admin") ? "/admin" : "/"}
              aria-label="الرئيسية"
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-background-second/30 hover:text-main sm:size-9"
            >
              <Home aria-hidden="true" className="size-4 sm:size-4.5" />
            </Link>
          </Tooltip>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={index}
              className="flex shrink-0 items-center gap-1.5 sm:gap-2"
            >
              <ChevronLeft
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground/50"
              />

              {isLast ? (
                <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-semibold text-foreground">
                  {item.icon && <span className="shrink-0">{item.icon}</span>}

                  <span>{item.label}</span>
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-muted-foreground transition-colors hover:text-main"
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}

                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-muted-foreground">
                  {item.icon && <span className="shrink-0">{item.icon}</span>}

                  <span>{item.label}</span>
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
