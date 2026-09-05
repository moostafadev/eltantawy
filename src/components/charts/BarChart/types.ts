import { COLOR } from "@/constants/types";

import { ChartDataPoint } from "../shared/types";

export interface BarChartProps {
  data: ChartDataPoint[];
  color?: COLOR;
  height?: number;
  suffix?: string;
}
