"use client";

import { forwardRef } from "react";

import Spin from "../icons/Spin";
import { getColor, getSize } from "./lib";
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
      ...props
    },
    ref,
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        disabled={loading || props.disabled}
        className={`${getColor(color, variant)} ${getSize(size)} inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium hover:shadow-sm transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {loading ? <Spin className="size-5" /> : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
