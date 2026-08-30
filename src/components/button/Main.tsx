"use client";

import Spin from "../icons/Spin";
import { getColor, getSize } from "./lib";
import { IProps } from "./types";

const Button = ({
  children,
  className = "",
  color = "NEUTRAL",
  variant = "solid",
  loading = false,
  size = "md",
  ...props
}: IProps) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${getColor(color, variant)} ${getSize(size)} inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium hover:shadow-sm transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? <Spin className="size-5" /> : children}
    </button>
  );
};

export default Button;
