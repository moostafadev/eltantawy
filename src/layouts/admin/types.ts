import { Dispatch, ReactNode, SetStateAction } from "react";

export interface IProps {
  children: ReactNode;
}

export interface IPropsHeader {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
