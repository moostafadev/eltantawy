import { Dispatch, SetStateAction } from "react";

export interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
