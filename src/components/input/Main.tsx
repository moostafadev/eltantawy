"use client";

import { Eye, EyeOff, Hash, LockKeyhole, Phone } from "lucide-react";
import { useState } from "react";
import { FieldValues, useFormContext, useFormState } from "react-hook-form";

import { Button } from "../button";
import { Tooltip } from "../tooltip";
import { IProps } from "./types";
import {
  getInputType,
  isNumberType,
  isPasswordType,
  isPhoneType,
  sanitizeNumber,
  sanitizePhoneNumber,
} from "./lib";

/**
 * `react-hook-form`-connected text input. Must be used inside a `<Form>`.
 *
 * - `type="password"` adds a show/hide toggle button.
 * - `type="tel"` strips non-digit characters as the user types.
 * - `type="number"` renders as text internally (see `lib.ts`) and strips
 *   invalid characters, keeping at most one leading minus and one dot.
 * - `tel`, `password`, and `number` labels include matching icons.
 *
 * @example
 * <Input<LoginForm> name="email" label="Email" placeholder="you@mail.com" />
 */
const Input = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  className,
  showIconLabel = false,
}: IProps<T>) => {
  const { register, control } = useFormContext<T>();

  const { errors } = useFormState({
    control,
    name,
  });

  const [showPassword, setShowPassword] = useState(false);

  const error = errors[name];

  const errorMessage =
    typeof error?.message === "string" && error.message
      ? error.message
      : error?.type === "required"
        ? "This field is required"
        : undefined;

  const isPassword = isPasswordType(type);
  const isPhone = isPhoneType(type);
  const isNumber = isNumberType(type);
  const TypeIcon = isPhone
    ? Phone
    : isPassword
      ? LockKeyhole
      : isNumber
        ? Hash
        : null;

  const inputType = getInputType(type, showPassword);

  const { onChange, ...registerProps } = register(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPhone) {
      event.target.value = sanitizePhoneNumber(event.target.value);
    } else if (isNumber) {
      event.target.value = sanitizeNumber(event.target.value);
    }

    onChange(event);
  };

  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      {label && (
        <label
          htmlFor={name}
          className={`flex items-center gap-1.5 text-sm font-medium ${
            error ? "text-danger" : "text-foreground"
          }`}
        >
          {TypeIcon && (
            <Tooltip content={label} focusable={false}>
              <TypeIcon
                aria-hidden="true"
                className="size-3.5 text-muted-foreground"
              />
            </Tooltip>
          )}
          <span
            className={TypeIcon && !showIconLabel ? "sr-only" : undefined}
          >
            {label}
          </span>
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          inputMode={isPhone || isNumber ? "decimal" : undefined}
          autoComplete={isNumber ? "off" : undefined}
          className={`relative w-full border border-main/20 bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-main/60 focus:shadow-md focus:ring-2 focus:ring-main/15 disabled:cursor-not-allowed disabled:opacity-50 ${isPassword ? "pl-11" : "px-3"} `}
          {...registerProps}
          onChange={handleChange}
        />

        {isPassword && (
          <Tooltip
            content={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            focusable={false}
          >
            <Button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute left-0 top-0 h-full bg-main/80"
              color="MAIN"
              size="icon"
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </Tooltip>
        )}
      </div>

      {errorMessage && (
        <span className="text-xs font-medium text-danger">{errorMessage}</span>
      )}
    </div>
  );
};

export default Input;
