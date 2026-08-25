"use client";

import Spin from "../icons/Spin";
import { getColor, getSize } from "./lib";
import { IProps } from "./types";

const Button = ({
  children,
  className = "",
  color = "BLACK",
  loading = false,
  size = "md",
  ...props
}: IProps) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${getColor(color)} ${getSize(size)} cursor-pointer inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap shadow-sm transition-all duration-150 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-main/15 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? <Spin /> : children}
    </button>
  );
};

export default Button;
