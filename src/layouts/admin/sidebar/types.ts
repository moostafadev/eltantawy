import { LucideIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface SubItemsProps {
  items: SidebarItem[];
}

export interface SidebarItem {
  link: string;
  title: string;
  icon: LucideIcon;
  items: SidebarItem[];
  isActive?: boolean;
}
