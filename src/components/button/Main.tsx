"use client";

import Spin from "../icons/Spin";
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
      className={`${getColor(color)} ${getSize(size)} py-1 duration-150 hover:opacity-75 cursor-pointer shadow-sm ${loading && "opacity-60"} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? <Spin /> : children}
    </button>
  );
};

export default Button;
