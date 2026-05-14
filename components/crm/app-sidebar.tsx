"use client";

import { CarFront } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationItems } from "@/components/crm/nav-config";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className="crm-sidebar" collapsible="icon">
      <SidebarHeader
        className={`h-16 justify-center border-b border-sidebar-border/70 py-0 ${collapsed ? "px-0" : "px-3"}`}
      >
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-lg text-sidebar-foreground ${collapsed ? "justify-center px-0" : "px-2"}`}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <CarFront className="size-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Вантажні перевезення</div>
              <div className="text-xs text-sidebar-foreground/70">Операційна CRM</div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Модулі</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link
                        href={item.href}
                        onClick={() => setOpenMobile(false)}
                        className="flex items-center gap-2"
                      >
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-3">
        {collapsed ? (
          <div className="menu-badge mx-auto">{navigationItems.length}</div>
        ) : (
          <div className="rounded-xl bg-sidebar-accent/40 p-3 text-sm text-sidebar-foreground">
            <div className="font-medium">Етап 1: базовий облік</div>
            <div className="text-xs text-sidebar-foreground/70">
              Замовлення, клієнти, маршрути, водії, авто
            </div>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
