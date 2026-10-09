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
 * Reusable accordion that manages its open state through context.
 *
 * By default, only one item can be open at a time. Set `allowMultiple` to
 * allow multiple open items. Use with `AccordionItem` descendants.
 *
 * @example
 * <Accordion>
 *   <AccordionItem value="shipping" trigger={<span>Shipping</span>}>
 *     Delivery details
 *   </AccordionItem>
 *   <AccordionItem value="returns" trigger={<span>Returns</span>}>
 *     Return details
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
