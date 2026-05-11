import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { BadgeTone } from "@/lib/constants";

type KpiCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: string;
  tone?: BadgeTone;
};

export function KpiCard({ label, value, icon: Icon, delta, tone = "info" }: KpiCardProps) {
  const variant =
    tone === "default"
      ? "default"
      : (tone as
          | "success"
          | "warning"
          | "info"
          | "destructive"
          | "secondary"
          | "default");
  return (
    <div className="metric-card flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>
          <p className="metric-value">{value}</p>
        </div>
        <div className="rounded-lg bg-surface p-2 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
      {delta && <Badge variant={variant}>{delta}</Badge>}
    </div>
  );
}
