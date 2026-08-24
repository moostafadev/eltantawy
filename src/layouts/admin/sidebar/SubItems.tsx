"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SubItemsProps } from "./types";

const SubItems = ({ items }: SubItemsProps) => {
  const pathName = usePathname();

  return (
    <ul className="flex flex-col gap-1 mt-1 max-w-full">
      {items.map(({ icon: Icon, link, title, isActive }) => {
        const isCurrent = pathName === link;

        return (
          <li key={link} className="w-full">
            <Link
              href={isActive ? link : pathName}
              className={`
                  flex items-center gap-3
                  w-full
                  duration-300
                  ${isActive ? "" : "cursor-not-allowed opacity-50"}
                  ${
                    isCurrent
                      ? "bg-main text-background"
                      : "bg-main/5 hover:bg-main/10"
                  }
                  px-3 py-3
                  pr-7! hover:pr-8!
                  text-sm font-medium
                `}
            >
              <Icon className="size-4 shrink-0" />

              <span>{title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SubItems;
