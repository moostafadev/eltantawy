"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/button";
import { useDialog } from "@/components/dialog";

import CreateReturnDialog from "./Dialog";
import { Props } from "./types";

const CreateReturnButton = ({ orderId, items }: Props) => {
  const { openDialog } = useDialog();

  const handleOpen = () => {
    openDialog({
      title: "إنشاء مرتجع",
      children: <CreateReturnDialog orderId={orderId} items={items} />,
    });
  };

  return (
    <Button color="WARNING" variant="soft" size="sm" onClick={handleOpen}>
      <RotateCcw className="size-4" />
      <span>إنشاء مرتجع</span>
    </Button>
  );
};

export default CreateReturnButton;
