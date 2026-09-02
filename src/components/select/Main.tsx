"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  Controller,
  FieldValues,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { useEffect, useRef, useState } from "react";

import { IProps } from "./types";

/**
 * `react-hook-form`-connected custom dropdown select. Must be used inside
 * a `<Form>`. Closes on outside click; use `onValueChange` to react to
 * selection changes outside the form state (e.g. syncing another field).
 *
 * @example
 * <Select<ProductForm>
 *   name="categoryId"
 *   label="Category"
 *   placeholder="Choose a category"
 *   options={categoryOptions}
 * />
 */
const Select = <T extends FieldValues>({
  name,
  label,
  placeholder = "اختر...",
  options,
  className,
  disabled = false,
  onValueChange,
}: IProps<T>) => {
  const { control } = useFormContext<T>();

  const { errors } = useFormState({
    control,
    name,
  });

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const error = errors[name];

  const errorMessage =
    typeof error?.message === "string" && error.message
      ? error.message
      : error?.type === "required"
        ? "This field is required"
        : undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedOption = options.find(
          (option) => option.value === field.value,
        );

        return (
          <div
            ref={containerRef}
            className={`flex flex-col gap-1 ${className ?? ""}`}
          >
            {label && (
              <label
                htmlFor={name}
                className={`text-sm font-medium ${error ? "text-main" : "text-foreground"}`}
              >
                {label}
              </label>
            )}

            <div className="relative">
              <button
                id={name}
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                className={`flex h-8.5 w-full cursor-pointer items-center justify-between gap-2 border bg-background px-3 py-1.5 text-sm text-foreground outline-none transition-all duration-200 hover:border-main/40 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-main" : "border-main/20"} ${open ? "border-main/60 shadow-md ring-2 ring-main/15" : ""}`}
                aria-haspopup="listbox"
                aria-expanded={open}
              >
                <span
                  className={`truncate text-start ${selectedOption ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {selectedOption?.label ?? placeholder}
                </span>

                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && !disabled && (
                <div
                  role="listbox"
                  className="absolute inset-x-0 top-full z-50 mt-1 flex max-h-60 flex-col gap-px overflow-y-auto border border-main/20 bg-background p-1 shadow-md"
                >
                  {options.length > 0 ? (
                    options.map((option) => {
                      const isSelected = option.value === field.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            field.onChange(option.value);
                            field.onBlur();
                            onValueChange?.(option.value);
                            setOpen(false);
                          }}
                          className={`flex min-h-8 w-full cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-start text-sm transition-colors duration-150 ${isSelected ? "bg-main/10 text-main" : "text-foreground hover:bg-main/5"}`}
                        >
                          <span className="truncate">{option.label}</span>

                          {isSelected && (
                            <Check className="size-4 shrink-0 text-main" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-1.5 text-sm text-muted-foreground">
                      لا توجد خيارات
                    </div>
                  )}
                </div>
              )}
            </div>

            {errorMessage && (
              <span className="text-xs font-medium text-main">
                {errorMessage}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

export default Select;
