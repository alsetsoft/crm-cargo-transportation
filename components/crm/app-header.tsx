"use client";

import { usePathname } from "next/navigation";

import { navigationItems } from "@/components/crm/nav-config";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  const pathname = usePathname();
  const currentItem =
    [...navigationItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) =>
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
      ) ?? navigationItems[0];

  return (
    <header className="crm-header">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="size-9 shrink-0 rounded-md border border-border/70" />
        <div className="min-w-0">
          <div className="truncate text-xs text-muted-foreground">CRM · Вантажні перевезення</div>
          <div className="truncate text-sm font-semibold text-foreground sm:text-base">
            {currentItem.title}
          </div>
        </div>
      </div>
      <Badge variant="secondary" className="hidden sm:inline-flex">
        VlasnaCRM · Етап 1
      </Badge>
    </header>
  );
}
