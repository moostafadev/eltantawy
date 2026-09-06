"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Header } from "./header";
import { Footer } from "./footer";
import useScroll from "@/hooks/useScroll";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isScrolled = useScroll();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <Header isScrolled={isScrolled} />

      <main
        className={`${isScrolled ? "lg:mt-16" : "lg:mt-20"} flex flex-col items-stretch w-full min-h-[calc(100dvh-5rem)] transition-[margin] duration-300`}
      >
        {children}
      </main>

      <Footer />
    </>
  );
};

export default Wrapper;
