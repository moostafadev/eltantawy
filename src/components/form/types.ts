import { ReactNode } from "react";
import {
  FieldValues,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";

export interface IProps<T extends FieldValues> extends UseFormProps<T> {
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
  onFormReady?: (methods: UseFormReturn<T>) => void;
}
