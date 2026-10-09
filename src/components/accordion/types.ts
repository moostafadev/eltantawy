import { ReactNode } from "react";

export interface AccordionProps {
  children: ReactNode;
  /** Allows multiple items to stay open. Defaults to false. */
  allowMultiple?: boolean;
  /** Value of the item that is open by default when multiple items are disabled. */
  defaultOpenValue?: string;
  className?: string;
}

export interface AccordionContextValue {
  openValues: string[];
  toggle: (value: string) => void;
  isOpen: (value: string) => boolean;
}

export interface AccordionItemProps {
  value: string;
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}
