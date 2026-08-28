"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FieldValues, useFormContext, useFormState } from "react-hook-form";

import { Button } from "../button";
import { IProps } from "./types";
import {
  getInputType,
  isPasswordType,
  isPhoneType,
  sanitizePhoneNumber,
} from "./lib";

const Input = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  className,
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

  const inputType = getInputType(type, showPassword);

  const { onChange, ...registerProps } = register(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPhone) {
      event.target.value = sanitizePhoneNumber(event.target.value);
    }

    onChange(event);
  };

  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      {label && (
        <label
          htmlFor={name}
          className={`text-sm font-medium ${
            error ? "text-danger" : "text-foreground"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          inputMode={isPhone ? "numeric" : undefined}
          className={`relative w-full border border-main/20 bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-main/60 focus:shadow-md focus:ring-2 focus:ring-main/15 disabled:cursor-not-allowed disabled:opacity-50 ${isPassword ? "pl-11" : "px-3"} `}
          {...registerProps}
          onChange={handleChange}
        />

        {isPassword && (
          <Button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute left-0 top-0 h-full bg-main/80 "
            color="MAIN"
            size="icon"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        )}
      </div>

      {errorMessage && (
        <span className="text-xs font-medium text-danger">{errorMessage}</span>
      )}
    </div>
  );
};

export default Input;
