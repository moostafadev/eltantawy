"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

import { Header } from "./header";
import { Footer } from "./footer";
import BackToTop from "./BackToTop";
import useScroll from "@/hooks/useScroll";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isScrolled = useScroll();

  useEffect(() => {
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    if (!pathname || pathname === "/admin" || pathname.startsWith("/admin/")) {
      return;
    }

    void fetch("/api/page-views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch((error: unknown) => {
      console.error("Record page view error:", error);
    });
  }, [pathname]);

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
      <BackToTop />
    </>
  );
};

export default Wrapper;
