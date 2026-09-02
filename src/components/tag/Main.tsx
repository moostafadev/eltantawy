"use client";

import { getColor, getSize } from "./lib";
import { TagProps } from "./types";

/**
 * Small rounded status/label pill. Uses the shared `COLOR` palette with
 * `solid` / `soft` / `outline` variants.
 *
 * @example
 * <Tag color="SUCCESS" variant="soft" size="sm">موثق</Tag>
 */
const Tag = ({
  children,
  color = "NEUTRAL",
  variant = "soft",
  size = "sm",
  className = "",
}: TagProps) => {
  return (
    <span
      className={`${getColor(color, variant)} ${getSize(size)} inline-flex w-fit items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;
