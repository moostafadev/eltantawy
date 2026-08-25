import { FieldValues, Path } from "react-hook-form";

export interface SelectOption {
  value: string;
  label: string;
}

export interface IProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}
