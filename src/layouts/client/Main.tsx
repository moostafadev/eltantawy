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
        className={`${isScrolled ? "mt-16" : "mt-20"} min-h-[calc(100dvh-5rem)] bg-background-second transition-[margin] duration-300`}
      >
        {children}
      </main>
    </>
  );
};

export default LayoutClient;
