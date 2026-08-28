import { FieldValues, Path } from "react-hook-form";

export interface IProps<T extends FieldValues = FieldValues> {
  name?: Path<T>;
  label?: string;
  disabled?: boolean;
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onValueChange?: (value: boolean) => void;
}
