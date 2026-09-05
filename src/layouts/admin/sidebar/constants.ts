import {
  Boxes,
  ChartNoAxesCombined,
  LayoutDashboard,
  Package,
  Percent,
  RotateCcw,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  Users,
} from "lucide-react";
import { SidebarItem } from "./types";

export const sidebarData: SidebarItem[] = [
  {
    link: "/admin",
    title: "لوحة التحكم",
    icon: LayoutDashboard,
    items: [],
    isActive: true,
  },
  {
    link: "/admin/users",
    title: "المستخدمين",
    icon: Users,
    items: [],
    isActive: true,
  },
  {
    link: "/admin/products",
    title: "الاصناف",
    icon: Package,
    items: [
      {
        link: "/admin/products/categories",
        title: "التصنيفات",
        icon: Tags,
        items: [],
        isActive: true,
      },
      {
        link: "/admin/products",
        title: "المنتجات",
        icon: Package,
        items: [],
        isActive: true,
      },
    ],
    isActive: true,
  },
  {
    link: "/admin/orders",
    title: "الطلبات",
    icon: ShoppingCart,
    items: [],
    isActive: true,
  },
  {
    link: "/admin/returns",
    title: "المرتجعات",
    icon: RotateCcw,
    items: [],
    isActive: true,
  },
  {
    link: "/admin/sales",
    title: "المبيعات",
    icon: ChartNoAxesCombined,
    items: [],
    isActive: false,
  },
  {
    link: "/admin/inventory",
    title: "المخزون",
    icon: Boxes,
    items: [],
    isActive: false,
  },
  {
    link: "/admin/settings",
    title: "الإعدادات",
    icon: Settings,
    items: [
      {
        link: "/admin/settings/delivery",
        title: "مناطق التوصيل",
        icon: Truck,
        items: [],
        isActive: true,
      },
      {
        link: "/admin/settings/discounts",
        title: "الخصومات",
        icon: Percent,
        items: [],
        isActive: true,
      },
    ],
    isActive: true,
  },
];
