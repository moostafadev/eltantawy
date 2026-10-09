"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/button";
import { useDialog } from "@/components/dialog";
import { Tooltip } from "@/components/tooltip";
import ConfirmDelete from "./Dialog";

interface Props {
  id: string;
}

const DeleteCategoryButton = ({ id }: Props) => {
  const { openDialog } = useDialog();

  const confirmDelete = () => {
    openDialog({
      title: "حذف التصنيف",
      children: <ConfirmDelete id={id} />,
    });
  };

  return (
    <Tooltip content="حذف التصنيف" focusable={false}>
      <Button
        size="icon"
        color="DANGER"
        onClick={confirmDelete}
        aria-label="حذف التصنيف"
      >
        <Trash2 aria-hidden="true" className="size-4 lg:size-5" />
      </Button>
    </Tooltip>
  );
};

export default DeleteCategoryButton;
