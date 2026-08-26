"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { DialogOptions } from "./types";
import { Button } from "../button";

interface Props extends DialogOptions {
  onClose: () => void;
  closing?: boolean;
}

const sizes = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const Dialog = ({
  title,
  content,
  size = "md",
  onClose,
  closing = false,
}: Props) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <div
      dir="rtl"
      onMouseDown={onClose}
      className={`fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm ${
        closing ? "animate-dialog-out" : "animate-dialog-in"
      }`}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={`relative w-full shrink-0 ${sizes[size]} border border-border bg-background p-4 shadow-md ${
          closing ? "animate-dialog-content-out" : "animate-dialog-content-in"
        }`}
      >
        {title && (
          <div className="mb-5 flex items-center justify-between gap-3 lg:gap-4 flex-wrap">
            <h2 className="lg:text-lg font-bold text-foreground">{title}</h2>

            <Button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center"
              size="icon"
              color="NEUTRAL"
              variant="soft"
            >
              <X className="size-3 lg:size-4" />
            </Button>
          </div>
        )}

        {content}
      </div>
    </div>
  );
};

export default Dialog;
