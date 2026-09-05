"use client";

import { ChevronDown } from "lucide-react";

import { useAccordion } from "./Main";
import { AccordionItemProps } from "./types";

/**
 * عنصر مفرد داخل `Accordion`. لازم يُستخدم داخل `<Accordion>`.
 *
 * `trigger` هو المحتوى اللي بيظهر دايمًا في الهيدر (بجوار سهم الفتح/الغلق)،
 * و`children` هو المحتوى اللي بيظهر بس لما العنصر يكون مفتوح.
 */
const AccordionItem = ({
  value,
  trigger,
  children,
  className = "",
  triggerClassName = "",
  contentClassName = "",
  disabled = false,
}: AccordionItemProps) => {
  const { toggle, isOpen } = useAccordion();

  const open = isOpen(value);

  return (
    <div
      className={`overflow-hidden border border-background-second/60 bg-background shadow-sm ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => toggle(value)}
        aria-expanded={open}
        className={`cursor-pointer flex w-full items-center justify-between gap-3 p-3 text-start transition-colors duration-200 hover:bg-background-second/10 disabled:cursor-not-allowed disabled:opacity-60 lg:p-4 ${triggerClassName}`}
      >
        <div className="min-w-0 flex-1">{trigger}</div>

        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180 text-main" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-t border-background-second/60 bg-muted/10 ${contentClassName}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
