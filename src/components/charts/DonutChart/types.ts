import { COLOR } from "@/constants/types";

export interface DonutChartDataPoint {
  label: string;
  value: number;
  color?: COLOR;
}

export interface DonutChartProps {
  data: DonutChartDataPoint[];
  size?: number;
  suffix?: string;
}
