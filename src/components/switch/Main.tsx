"use client";

import {
  Controller,
  FieldValues,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { IProps } from "./types";

/**
 * Toggle switch with two usage modes:
 *
 * 1. **Controlled** (no `name`, or `checked` is passed): plain on/off
 *    toggle driven by `checked` / `onCheckedChange`.
 * 2. **Form-connected** (`name` is passed, `checked` omitted): reads and
 *    writes a boolean field through `react-hook-form`. Must be used
 *    inside a `<Form>` in this mode.
 *
 * @example
 * // Controlled
 * <Switch checked={useImageUpload} onCheckedChange={setUseImageUpload} label="Upload method" />
 *
 * @example
 * // Form-connected
 * <Switch<ProductForm> name="isActive" label="Active" />
 */
const Switch = <T extends FieldValues>({
  name,
  label,
  disabled = false,
  className = "",
  checked,
  onCheckedChange,
  onValueChange,
}: IProps<T>) => {
  const isControlled = checked !== undefined || !name;

  if (isControlled) {
    const value = Boolean(checked);

    const handleChange = () => {
      if (disabled) return;

      const nextValue = !value;

      onCheckedChange?.(nextValue);
      onValueChange?.(nextValue);
    };

    return (
      <SwitchUI
        checked={value}
        label={label}
        disabled={disabled}
        className={className}
        onChange={handleChange}
      />
    );
  }

  return (
    <FormSwitch
      name={name}
      label={label}
      disabled={disabled}
      className={className}
      onValueChange={onValueChange}
    />
  );
};

interface SwitchUIProps {
  checked: boolean;
  label?: string;
  disabled?: boolean;
  className?: string;
  onChange: () => void;
  error?: boolean;
  errorMessage?: string;
}

const SwitchUI = ({
  checked,
  label,
  disabled = false,
  className = "",
  onChange,
  error = false,
  errorMessage,
}: SwitchUIProps) => {
  return (
    <div dir="rtl" className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {label && (
          <label
            className={`select-none text-sm font-medium leading-6 transition-colors ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${error ? "text-main" : "text-foreground"}`}
          >
            {label}
          </label>
        )}

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          disabled={disabled}
          onClick={onChange}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors duration-200 ease-out ${checked ? "bg-main" : "bg-border"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-90"} ${error ? "ring-2 ring-main/20" : ""} focus-visible:ring-2 focus-visible:ring-main/30 focus-visible:ring-offset-2`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none block size-5 rounded-full bg-background shadow-sm ring-1 ring-black/5 transition-transform duration-200 ease-out ${checked ? "-translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      {errorMessage && (
        <span className="text-xs font-medium text-main">{errorMessage}</span>
      )}
    </div>
  );
};

interface FormSwitchProps<T extends FieldValues> {
  name?: IProps<T>["name"];
  label?: string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: boolean) => void;
}

const FormSwitch = <T extends FieldValues>({
  name,
  label,
  disabled = false,
  className = "",
  onValueChange,
}: FormSwitchProps<T>) => {
  const { control } = useFormContext<T>();

  const { errors } = useFormState({
    control,
    name,
  });

  const error = name ? errors[name] : undefined;

  const errorMessage =
    typeof error?.message === "string" && error.message
      ? error.message
      : error?.type === "required"
        ? "هذا الحقل مطلوب"
        : undefined;

  return (
    <Controller
      name={name!}
      control={control}
      render={({ field }) => {
        const checked = Boolean(field.value);

        const handleChange = () => {
          if (disabled) return;

          const nextValue = !checked;

          field.onChange(nextValue);
          field.onBlur();
          onValueChange?.(nextValue);
        };

        return (
          <SwitchUI
            checked={checked}
            label={label}
            disabled={disabled}
            className={className}
            onChange={handleChange}
            error={Boolean(error)}
            errorMessage={errorMessage}
          />
        );
      }}
    />
  );
};

export default Switch;
