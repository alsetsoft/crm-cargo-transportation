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
      <div className="flex items-center gap-3">
        <SidebarTrigger className="size-9 rounded-md border border-border/70" />
        <div>
          <div className="text-xs text-muted-foreground">CRM · Вантажні перевезення</div>
          <div className="text-sm font-semibold text-foreground sm:text-base">
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
