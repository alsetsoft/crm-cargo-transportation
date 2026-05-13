import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  type LucideIcon,
  Truck,
  UserRound,
  Wallet,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const navigationItems: NavItem[] = [
  {
    title: "Аналітика",
    href: "/",
    icon: LayoutDashboard,
    description: "Загальний огляд автопарку",
  },
  {
    title: "Замовлення",
    href: "/orders",
    icon: ClipboardList,
    description: "Реєстр транспортних замовлень",
  },
  {
    title: "Клієнти",
    href: "/clients",
    icon: Building2,
    description: "База замовників",
  },
  {
    title: "Водії",
    href: "/drivers",
    icon: UserRound,
    description: "Водійський склад",
  },
  {
    title: "Автомобілі",
    href: "/vehicles",
    icon: Truck,
    description: "Рухомий склад",
  },
  {
    title: "Витрати",
    href: "/expenses",
    icon: Wallet,
    description: "Реєстр витрат",
  },
];
