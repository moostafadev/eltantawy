import { COLOR } from "@/constants/types";

import { ChartDataPoint } from "../shared/types";

export interface LineChartProps {
  data: ChartDataPoint[];
  color?: COLOR;
  height?: number;
  area?: boolean;
  suffix?: string;
}
