"use client";

import { IPropsHeader } from "./types";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";

const HeaderAdmin = ({ isOpen }: IPropsHeader) => {
  return (
    <header
      className={`z-40 fixed top-0 left-0 ${isOpen ? "w-[calc(100%-16rem)]" : "w-[calc(100%-4rem)]"} duration-300 h-16 bg-background/30 backdrop-blur-md shadow-sm border-b border-b-background-second/20 flex items-center justify-between gap-3 p-3 lg:p-4`}
    >
      <div className="flex items-center gap-3 mr-auto">
        <Link href={"/profile"}>
          <CircleUserRound
            className="text-foreground transition-colors hover:text-main"
            size={22}
            strokeWidth={1.75}
          />
        </Link>
      </div>
    </header>
  );
};

export default HeaderAdmin;
