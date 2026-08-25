"use client";

import { IProps } from "./types";
import { Button } from "@/components/button";
import { ChevronDown, Globe, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sidebarData } from "./constants";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logoutButton";
import { useState } from "react";
import SubItems from "./SubItems";

const SidebarAdmin = ({ isOpen, setIsOpen }: IProps) => {
  const pathName = usePathname();

  const [openItems, setOpenItems] = useState<string[]>([]);

  const activeParents = sidebarData
    .filter((item) => item.items.some((subItem) => subItem.link === pathName))
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

      const hasActiveChild = items.some((item) => item.link === pathName);

      return (
        <li key={link} className="w-full">
          {/* Parent */}
          {hasItems ? (
            <button
              type="button"
              disabled={!isActive}
              onClick={() => toggleItem(link)}
              className={`flex items-center gap-3 lg:gap-4 w-full duration-300 ${
                isActive
                  ? "bg-main/5 hover:bg-main/10 cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              } ${
                hasActiveChild ? "bg-main text-main" : ""
              } ${isOpen ? "px-3 lg:px-4" : "px-1 justify-center"} py-3 lg:py-4 font-medium `}
            >
              <Icon className="size-5 shrink-0" />

              {isOpen && (
                <>
                  <span className="flex-1 text-right">{title}</span>

                  <ChevronDown
                    className={`size-4 duration-300 ${isOpenItem ? "rotate-180" : ""} `}
                  />
                </>
              )}
            </button>
          ) : (
            <Link
              href={isActive ? link : pathName}
              className={`flex items-center gap-3 lg:gap-4 w-full duration-300 ${
                isActive ? "" : "cursor-not-allowed opacity-50"
              } ${
                isCurrent
                  ? "bg-main text-background"
                  : "bg-main/5 hover:bg-main/10"
              } ${isOpen ? "px-3 lg:px-4" : "px-1 justify-center"} py-3 lg:py-4 font-medium `}
            >
              <Icon className="size-5 shrink-0" />

              {isOpen && <span>{title}</span>}
            </Link>
          )}

          {/* Sub Items */}
          {hasItems && isOpen && isOpenItem && <SubItems items={items} />}
        </li>
      );
    });

  return (
    <aside
      className={`z-50 ${
        isOpen ? "w-3xs" : "w-16"
      } bg-background duration-300 flex flex-col items-center py-4 fixed top-0 right-0 h-full overflow-hidden shadow-sm border-l border-l-background-second/20 `}
    >
      {/* Toggle */}
      <Button
        size="icon"
        color="MAIN"
        className={`fixed ${isOpen ? "right-68" : "right-20"} top-4 lg:top-4 z-50`}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Overlay */}
      <div
        className={`fixed top-0 right-64 ${
          isOpen ? "w-full lg:w-0 opacity-100" : "w-0 opacity-0"
        } transition-opacity h-full bg-foreground/20 z-40 `}
        onClick={() => setIsOpen(false)}
      />

      {/* Logo */}
      <Link
        href="/admin"
        onClick={() => setIsOpen(false)}
        className={`flex items-center justify-center max-w-40 ${
          isOpen ? "mx-3 lg:mx-4" : "mx-1"
        } pb-4 border-b border-b-background-second `}
      >
        <Image
          src="/logo-2.png"
          alt="الطنطاوي"
          width={500}
          height={500}
          className="max-w-full h-auto object-cover"
          priority
        />
      </Link>

      {/* Navigation */}
      <nav className="py:3 lg:py-4 w-full flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <ul className="w-full flex flex-col gap-1">{renderNav()}</ul>
      </nav>

      {/* Logout */}
      <div
        className={`mt-auto flex flex-col gap-1 ${isOpen ? "px-3 lg:px-4" : "px-0"} w-full shrink-0`}
      >
        <Link href={"/"}>
          <Button
            className={`flex items-center justify-center gap-3 lg:gap-4 w-full ${isOpen ? "" : "px-3! lg:px-4!"}`}
            color="WHITE"
            size="lg"
          >
            <Globe className="size-5" />
            {isOpen ? <span>الصفحة الرئيسية</span> : <></>}
          </Button>
        </Link>
        <LogoutButton
          className={`w-full justify-center ${isOpen ? "" : "px-3! lg:px-4!"}`}
          size="xs"
        >
          <LogOut className="size-5" />
          {isOpen ? (
            <>
              <span>تسجيل الخروج</span>
            </>
          ) : (
            <></>
          )}
        </LogoutButton>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
