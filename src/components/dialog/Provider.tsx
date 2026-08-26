"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { DialogContextValue, DialogOptions } from "./types";
import Dialog from "./Main";

const DialogContext = createContext<DialogContextValue | null>(null);

interface Props {
  children: ReactNode;
}

const DialogProvider = ({ children }: Props) => {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);
  const [closing, setClosing] = useState(false);

  const openDialog = useCallback((options: DialogOptions) => {
    setClosing(false);
    setDialog(options);
  }, []);

  const closeDialog = useCallback(() => {
    setClosing(true);

    setTimeout(() => {
      setDialog(null);
      setClosing(false);
    }, 200);
  }, []);

  const value = useMemo(
    () => ({
      openDialog,
      closeDialog,
    }),
    [openDialog, closeDialog],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}

      {dialog && <Dialog {...dialog} closing={closing} onClose={closeDialog} />}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used inside DialogProvider");
  }

  return context;
};

export default DialogProvider;
