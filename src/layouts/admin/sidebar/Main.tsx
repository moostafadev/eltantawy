"use client";

import { IProps } from "./types";
import { Button } from "@/components/button";
import { ChevronDown, Globe, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { LoadingImage as Image } from "@/components/loading-image";
import { sidebarData } from "./constants";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logoutButton";
import { useState } from "react";
import SubItems from "./SubItems";

const SidebarAdmin = ({ isOpen, setIsOpen }: IProps) => {
  const pathName = usePathname();

  const [openItems, setOpenItems] = useState<string[]>([]);

  const activeParents = sidebarData
    .filter((item) =>
      item.items.some(
        (subItem) =>
          pathName === subItem.link || pathName.startsWith(`${subItem.link}/`),
      ),
    )
    .map((item) => item.link);

  const toggleItem = (link: string) => {
    setIsOpen(true);
    setOpenItems((prev) =>
      prev.includes(link)
        ? prev.filter((item) => item !== link)
        : [...prev, link],
    );
  };

  const renderNav = () =>
    sidebarData.map(({ icon: Icon, items, link, title, isActive }) => {
      const hasItems = items.length > 0;
      const isOpenItem =
        openItems.includes(link) || activeParents.includes(link);

      const isCurrent = pathName === link;

      const hasActiveChild = items.some(
        (item) =>
          pathName === item.link || pathName.startsWith(`${item.link}/`),
      );

      const navControl = hasItems ? (
        <button
          type="button"
          disabled={!isActive}
          onClick={() => toggleItem(link)}
          aria-label={title}
          className={`flex items-center gap-3 lg:gap-4 w-full duration-300 ${
            isActive
              ? "bg-main/5 hover:bg-main/10 cursor-pointer"
              : "cursor-not-allowed opacity-50"
          } ${
            hasActiveChild ? "bg-main text-main" : ""
          } ${isOpen ? "px-3 lg:px-4" : "px-1 justify-center lg:px-4 lg:justify-start"} py-3 lg:py-4 font-medium `}
        >
          <Icon aria-hidden="true" className="size-5 shrink-0" />

          <span
            className={`${isOpen ? "flex-1" : "hidden lg:flex lg:flex-1"} text-right`}
          >
            {title}
          </span>

          <ChevronDown
            aria-hidden="true"
            className={`size-4 duration-300 ${isOpenItem ? "rotate-180" : ""} ${isOpen ? "" : "hidden lg:block"}`}
          />
        </button>
      ) : (
        <Link
          href={isActive ? link : pathName}
          aria-label={title}
          className={`flex items-center gap-3 lg:gap-4 w-full duration-300 ${
            isActive ? "" : "cursor-not-allowed opacity-50"
          } ${
            isCurrent
              ? "bg-main text-background"
              : "bg-main/5 hover:bg-main/10"
          } ${isOpen ? "px-3 lg:px-4" : "px-1 justify-center lg:px-4 lg:justify-start"} py-3 lg:py-4 font-medium `}
        >
          <Icon aria-hidden="true" className="size-5 shrink-0" />

          <span className={isOpen ? "" : "hidden lg:inline"}>{title}</span>
        </Link>
      );

      return (
        <li key={link} className="w-full">
          {navControl}

          {/* Sub Items */}
          {hasItems && isOpenItem && (
            <div className={isOpen ? "" : "hidden lg:block"}>
              <SubItems items={items} />
            </div>
          )}
        </li>
      );
    });

  return (
    <aside
      className={`z-50 ${
        isOpen ? "w-3xs" : "w-16 lg:w-3xs"
      } bg-background duration-300 flex flex-col gap-3 lg:gap-4 items-center py-3 lg:py-4 fixed top-0 right-0 h-full overflow-hidden shadow-sm border-l border-l-background-second/20 `}
    >
      {/* Toggle */}
      <Button
        size="icon"
        color="MAIN"
        aria-label={isOpen ? "إغلاق القائمة الجانبية" : "فتح القائمة الجانبية"}
        className={`fixed ${isOpen ? "right-68" : "right-20"} top-3.5 lg:top-4.5 z-50 lg:hidden`}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Overlay */}
      <div
        className={`fixed top-0 right-64 ${
          isOpen ? "w-full lg:w-0 opacity-100" : "w-0 opacity-0"
        } transition-opacity h-full bg-foreground/20 z-40 lg:hidden`}
        onClick={() => setIsOpen(false)}
      />

      {/* Logo */}
      <Link
        href="/admin"
        onClick={() => setIsOpen(false)}
        className={`flex items-center justify-center max-w-40 ${
          isOpen ? "mx-3 lg:mx-4" : "mx-1 lg:mx-4"
        } pb-3 lg:pb-4 border-b border-b-background-second `}
      >
        <Image
          src="/logo-2.png"
          alt="الطنطاوي"
          width={500}
          height={500}
          className="max-w-full max-h-30 lg:max-h-full w-auto object-cover"
          priority
        />
      </Link>

      {/* Navigation */}
      <nav className="w-full flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <ul className="w-full flex flex-col gap-1">{renderNav()}</ul>
      </nav>

      {/* Logout */}
      <div
        className={`mt-auto flex flex-col gap-1 ${isOpen ? "px-3 lg:px-4" : "px-0 lg:px-4"} w-full shrink-0`}
      >
        <Link href={"/"}>
          <Button
            className={`flex items-center justify-center gap-3 lg:gap-4 w-full ${isOpen ? "lg:justify-start" : "px-3! lg:px-4! lg:justify-start"}`}
            color="NEUTRAL"
            variant="outline"
            size="sm"
          >
            <Globe className="size-5" />
            <span className={isOpen ? "" : "hidden lg:inline"}>
              الصفحة الرئيسية
            </span>
          </Button>
        </Link>
        <LogoutButton
          className={`w-full justify-center lg:justify-start ${isOpen ? "" : "px-3! lg:px-4!"}`}
          size="sm"
        >
          <LogOut className="size-5" />
          <span className={isOpen ? "" : "hidden lg:inline"}>تسجيل الخروج</span>
        </LogoutButton>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
