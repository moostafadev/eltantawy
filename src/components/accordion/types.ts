import { ReactNode } from "react";

export interface AccordionProps {
  children: ReactNode;
  /** يسمح بفتح أكثر من عنصر في نفس الوقت، افتراضيًا false (عنصر واحد فقط) */
  allowMultiple?: boolean;
  /** قيمة العنصر المفتوح افتراضيًا (لو allowMultiple = false) */
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
