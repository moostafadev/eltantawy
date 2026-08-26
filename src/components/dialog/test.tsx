"use client";

import { useDialog } from "@/components/dialog";

const Example = () => {
  const { openDialog, closeDialog } = useDialog();

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          openDialog({
            title: "بيانات المستخدم",
            size: "md",
            content: (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  هذا محتوى الـ dialog
                </p>

                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-xl bg-main px-4 py-2 text-sm font-semibold text-main-foreground"
                >
                  إغلاق
                </button>
              </div>
            ),
          })
        }
        className="rounded-xl bg-main px-4 py-2 text-sm font-semibold text-main-foreground"
      >
        فتح Dialog
      </button>
    </div>
  );
};

export default Example;
