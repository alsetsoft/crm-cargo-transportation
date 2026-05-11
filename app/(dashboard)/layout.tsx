import type { ReactNode } from "react";

import { AppHeader } from "@/components/crm/app-header";
import { AppSidebar } from "@/components/crm/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <div className="crm-layout">
          <div className="crm-main">
            <AppSidebar />
            <SidebarInset>
              <AppHeader />
              <div className="crm-content">
                <div className="crm-content-frame">{children}</div>
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
