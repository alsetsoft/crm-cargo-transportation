import {
  Building2,
  ClipboardList,
  History,
  LayoutDashboard,
  type LucideIcon,
  MapPin,
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

// Primary sidebar nav. "Coming soon" entries are defined locally inside
// components/crm/app-shell.tsx (they have no route and are decorative).
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
    title: "GPS трекінг",
    href: "/gps",
    icon: MapPin,
    description: "Онлайн-моніторинг автопарку",
  },
  {
    title: "Витрати",
    href: "/expenses",
    icon: Wallet,
    description: "Реєстр витрат",
  },
  {
    title: "Логи",
    href: "/logs",
    icon: History,
    description: "Журнал змін у CRM",
  },
];
