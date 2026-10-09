import { COLOR } from "@/constants/types";

export interface IProps {
  color?: COLOR;
  count?: number;
  height?: number;
  width?: number;
  aspectRatio?: number | string;
  className?: string;
}
