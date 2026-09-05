import { BarChart3 } from "lucide-react";

/**
 * حالة فارغة موحّدة تظهر داخل أي Chart لو مفيش بيانات كافية لعرضها.
 */
export const ChartEmptyState = () => {
  return (
    <div className="flex min-h-32 flex-1 flex-col items-center justify-center gap-2 text-center">
      <div className="flex size-10 items-center justify-center bg-muted text-muted-foreground">
        <BarChart3 className="size-5" />
      </div>

      <p className="text-sm text-muted-foreground">
        لا توجد بيانات كافية لعرض الرسم البياني
      </p>
    </div>
  );
};
