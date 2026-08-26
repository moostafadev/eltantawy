"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/button";
import { useToast } from "@/components/toaster";
import { useDialog } from "@/components/dialog";

import { deleteCategoryAction } from "./deleteCategory.service";

interface Props {
  id: string;
}

const DeleteCategoryButton = ({ id }: Props) => {
  const { toast } = useToast();
  const { openDialog, closeDialog } = useDialog();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const result = await deleteCategoryAction(id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  console.log(loading);

  const confirmDelete = () => {
    openDialog({
      title: "حذف التصنيف",
      content: (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-muted-foreground">
            هل أنت متأكد من حذف هذا التصنيف؟
            <br />
            سيتم حذف جميع التصنيفات الفرعية التابعة له أيضًا.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              color="NEUTRAL"
              variant="outline"
              onClick={closeDialog}
            >
              إلغاء
            </Button>

            <Button
              type="button"
              color="DANGER"
              loading={loading}
              onClick={handleDelete}
            >
              حذف
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <Button size="icon" color="DANGER" onClick={confirmDelete}>
      <Trash2 className="size-4 lg:size-5" />
    </Button>
  );
};

export default DeleteCategoryButton;
