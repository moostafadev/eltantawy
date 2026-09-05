import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

import { COLOR } from "@/constants/types";

import { getIconColorClasses } from "./colors";

interface ChartCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  color?: COLOR;
  children: ReactNode;
  className?: string;
}

/**
 * Container موحّد لأي رسم بياني: هيدر (عنوان + وصف + أيقونة) بنفس
 * تصميم بطاقات الداشبورد الحالية، والمحتوى (الرسم نفسه) تحته.
 *
 * @example
 * <ChartCard title="حالة الطلبات" icon={PieChart} color="INFO">
 *   <DonutChart data={data} />
 * </ChartCard>
 */
export const ChartCard = ({
  title,
  description,
  icon: Icon,
  color = "MAIN",
  children,
  className = "",
}: ChartCardProps) => {
  const styles = getIconColorClasses(color);

  return (
    <section
      className={`flex flex-col gap-4 overflow-hidden border border-background-second/20 bg-background p-3 shadow-sm lg:p-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3 lg:pb-4">
        <div className="min-w-0">
          <h2 className="truncate font-bold">{title}</h2>

          {description && (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`flex size-10 shrink-0 items-center justify-center ${styles.bg} ${styles.text}`}
          >
            <Icon className="size-5" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">{children}</div>
    </section>
  );
};
