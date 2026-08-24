import { COLOR } from "@/constants/types";
import { ReactNode } from "react";
import { TSize } from "../button/types";

export interface IProps {
  children?: ReactNode;
  className?: string;
  color?: COLOR;
  size?: TSize;
}
