import { Button } from "@/components/button";
import { useDialog } from "@/components/dialog";
import { useToast } from "@/components/toaster";
import { useState } from "react";
import { deleteDeliveryZoneAction } from "./deleteDeliveryZone.service";

const ConfirmDelete = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const { closeDialog } = useDialog();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const result = await deleteDeliveryZoneAction(id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      closeDialog();
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        هل أنت متأكد من حذف هذه المنطقة؟
        <br />
        سيتم حذف جميع المناطق الفرعية التابعة لها أيضًا.
      </p>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          color="NEUTRAL"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={closeDialog}
        >
          إلغاء
        </Button>

        <Button
          type="button"
          color="DANGER"
          size="sm"
          loading={loading}
          onClick={handleDelete}
        >
          حذف
        </Button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
