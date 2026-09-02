"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/button";
import { useDialog } from "@/components/dialog";

import ConfirmDelete from "./Dialog";

interface Props {
  id: string;
}

const DeleteDiscountButton = ({ id }: Props) => {
  const { openDialog } = useDialog();

  const confirmDelete = () => {
    openDialog({
      title: "حذف الخصم",
      children: <ConfirmDelete id={id} />,
    });
  };

  return (
    <Button size="icon" color="DANGER" onClick={confirmDelete}>
      <Trash2 className="size-4 lg:size-5" />
    </Button>
  );
};

export default DeleteDiscountButton;
