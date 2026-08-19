"use client";

import { Button } from "@/components/button";
import { Menu, X } from "lucide-react";
import { IProps } from "../types";

const ButtonMobile = ({ isOpen, setIsOpen }: IProps) => {
  return (
    <Button
      type="button"
      onClick={() => setIsOpen((prev) => !prev)}
      color="MAIN"
      size="xs"
      className="lg:hidden"
    >
      {isOpen ? (
        <X className="text-background" size={24} strokeWidth={1.75} />
      ) : (
        <Menu className="text-background" size={24} strokeWidth={1.75} />
      )}
    </Button>
  );
};

export default ButtonMobile;
