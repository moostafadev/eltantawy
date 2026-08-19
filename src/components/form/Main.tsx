"use client";

import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { IProps } from "./types";

const Form = <T extends FieldValues>({
  onSubmit,
  children,
  className,
  ...formOptions
}: IProps<T>) => {
  const methods = useForm<T>(formOptions);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
