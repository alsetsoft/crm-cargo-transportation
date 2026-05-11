import { Badge } from "@/components/ui/badge";
import type { BadgeTone } from "@/lib/constants";

type StatusBadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function StatusBadge({ label, tone = "secondary" }: StatusBadgeProps) {
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
  return <Badge variant={variant}>{label}</Badge>;
}
