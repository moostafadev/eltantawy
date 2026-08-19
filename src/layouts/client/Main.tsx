"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Header } from "./header";
import useScroll from "@/hooks/useScroll";

const LayoutClient = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isScrolled = useScroll();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <Header isScrolled={isScrolled} />

      <main
        className={`${isScrolled ? "mb-16 lg:mb-0 lg:mt-16" : "mb-20 lg:mb-0 lg:mt-20"} w-full min-h-[calc(100dvh-5rem)] transition-[margin] duration-300`}
      >
        {children}
      </main>
    </>
  );
};

export default LayoutClient;
