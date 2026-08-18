"use client";

import { FieldValues, useFormContext, useFormState } from "react-hook-form";
import { IProps } from "./types";

const Input = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
}: IProps<T>) => {
  const { register, control } = useFormContext<T>();

  const { errors } = useFormState({
    control,
    name,
  });

  const error = errors[name];

  const errorMessage =
    typeof error?.message === "string" && error.message
      ? error.message
      : error?.type === "required"
        ? "This field is required"
        : undefined;

  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />

      {errorMessage && (
        <span style={{ color: "red", display: "block" }}>{errorMessage}</span>
      )}
    </div>
  );
};

export default Input;
