import { Package } from "lucide-react";
import {
  HomeIcon,
  UserIcon,
  CalculatorIcon,
  CalendarDaysIcon,
  FolderPlusIcon,
  SwatchIcon,
  UserPlusIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export const links = [
  {
    name: "Dashboard",
    path: "/",
    icon: HomeIcon,
    visible: true,
    isExtended: false,
  },
  {
    name: "Products",
    path: "/products",
    icon: Package,
    visible: true,
    isExtended: false,
  },
  {
    name: "Suppliers",
    path: "/suppliers",
    icon: UserIcon,
    visible: true,
    isExtended: false,
  },
  {
    name: "Stock Alerts",
    path: "/stock-alerts",
    icon: ExclamationCircleIcon,
    visible: true,
    isExtended: true,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: CalculatorIcon,
    visible: true,
    isExtended: false,
  },
  {
    name: "Log",
    path: "/logs",
    icon: CalendarDaysIcon,
    visible: true,
    isExtended: false,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: ChartBarIcon,
    visible: true,
    isExtended: false,
  },
];

export const quickLinks = [
  {
    name: "New Product",
    path: "/add-product",
    icon: FolderPlusIcon,
    visible: true,
  },
  {
    name: "New Supplier",
    path: "/add-supplier",
    icon: UserPlusIcon,
    visible: true,
  },
  {
    name: "Make Sale Transaction",
    path: "/add-transaction",
    icon: SwatchIcon,
    visible: true,
  },
  {
    name: "Make Purchase Transaction",
    path: "/add-transaction",
    icon: SwatchIcon,
    visible: true,
  },
];
