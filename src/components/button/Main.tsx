"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";

import Spin from "../icons/Spin";
import { getCardStyles, getColor, getSize } from "./lib";
import { IProps } from "./types";

const Button = forwardRef<HTMLButtonElement, IProps>(
  (
    {
      children,
      className = "",
      color = "NEUTRAL",
      variant = "solid",
      loading = false,
      size = "md",
      selected = false,
      ...props
    },
    ref,
  ) => {
    const isCard = variant === "card";

    return (
      <button
        {...props}
        ref={ref}
        disabled={loading || props.disabled}
        className={`${
          isCard
            ? `relative flex-col gap-1 border text-center ${getCardStyles(selected)}`
            : getColor(color, variant)
        } ${getSize(size)} inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium hover:shadow-sm transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {isCard && selected && (
          <span className="absolute -left-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-main text-main-foreground shadow-sm">
            <Check className="size-3" strokeWidth={3} />
          </span>
        )}

        {loading ? <Spin className="size-5" /> : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
