import { ReactNode } from "react";

export interface DialogOptions {
  title?: string;
  content: ReactNode;
  size?: "md" | "lg" | "xl";
}

export interface DialogContextValue {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}
