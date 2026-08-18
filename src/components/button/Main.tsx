"use client";

import { getColor, getSize } from "./lib";
import { IProps } from "./types";

const Button = ({
  children,
  className,
  color = "BLACK",
  loading = false,
  size = "md",
  ...props
}: IProps) => {
  return (
    <button
      className={`${getColor(color)} ${getSize(size)} py-1 duration-150 hover:opacity-75 cursor-pointer ${loading && "opacity-60"} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? "...Loading" : children}
    </button>
  );
};

export default Button;
