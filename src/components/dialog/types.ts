import { ReactNode } from "react";

export interface DialogOptions {
  title?: string;
  size?: "md" | "lg" | "xl";
  children: ReactNode;
}

export interface DialogContextValue {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}
