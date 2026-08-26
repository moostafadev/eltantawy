"use client";

import { useEffect } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";

import { IProps } from "./types";

const Form = <T extends FieldValues>({
  onSubmit,
  children,
  className,
  onFormReady,
  ...formOptions
}: IProps<T>) => {
  const methods = useForm<T>(formOptions);

  useEffect(() => {
    onFormReady?.(methods);
  }, [methods, onFormReady]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
