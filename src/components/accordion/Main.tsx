"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { AccordionContextValue, AccordionProps } from "./types";

const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * Accordion عام قابل لإعادة الاستخدام. بيدير حالة الفتح/الغلق داخليًا
 * عبر Context، ويدعم وضعين:
 *
 * - `allowMultiple=false` (افتراضي): عنصر واحد مفتوح فقط في نفس الوقت.
 * - `allowMultiple=true`: كل العناصر تقدر تتفتح مع بعضها.
 *
 * يُستخدم مع `AccordionItem` كأبناء مباشرين أو غير مباشرين.
 *
 * @example
 * <Accordion>
 *   <AccordionItem value="1" trigger={<span>العنوان الأول</span>}>
 *     المحتوى الأول
 *   </AccordionItem>
 *   <AccordionItem value="2" trigger={<span>العنوان الثاني</span>}>
 *     المحتوى الثاني
 *   </AccordionItem>
 * </Accordion>
 */
const Accordion = ({
  children,
  allowMultiple = false,
  defaultOpenValue,
  className = "",
}: AccordionProps) => {
  const [openValues, setOpenValues] = useState<string[]>(
    defaultOpenValue ? [defaultOpenValue] : [],
  );

  const toggle = useCallback(
    (value: string) => {
      setOpenValues((current) => {
        const isCurrentlyOpen = current.includes(value);

        if (allowMultiple) {
          return isCurrentlyOpen
            ? current.filter((item) => item !== value)
            : [...current, value];
        }

        return isCurrentlyOpen ? [] : [value];
      });
    },
    [allowMultiple],
  );

  const isOpen = useCallback(
    (value: string) => openValues.includes(value),
    [openValues],
  );

  const contextValue = useMemo<AccordionContextValue>(
    () => ({
      openValues,
      toggle,
      isOpen,
    }),
    [openValues, toggle, isOpen],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={`flex flex-col gap-3 lg:gap-4 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export const useAccordion = () => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("useAccordion must be used inside Accordion");
  }

  return context;
};

export default Accordion;
