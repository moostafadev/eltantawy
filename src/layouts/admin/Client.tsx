"use client";

import { useState } from "react";
import { IProps } from "./types";
import HeaderAdmin from "./Header";
import SidebarAdmin from "./sidebar/Main";

const ClientAdmin = ({ children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <HeaderAdmin isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="min-h-[calc(100dvh-4rem)] w-full">
        <SidebarAdmin isOpen={isOpen} setIsOpen={setIsOpen} />
        <article
          className={`mt-16 ${isOpen ? "lg:mr-64" : ""} mr-16 p-3 lg:p-4 duration-300`}
        >
          {children}
        </article>
      </main>
      <footer></footer>
    </>
  );
};

export default ClientAdmin;
