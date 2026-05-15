import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { LucideIcon } from "lucide-react";

import type { BadgeTone } from "@/lib/constants";

type KpiCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: string;
  tone?: BadgeTone;
};

// Avatar background per tone. Strong filled fill (M3 primary-container
// would normally be a soft tint; this design uses the full saturated
// brand colour with white icon — matches the dashboard mock).
const AVATAR_BG: Record<BadgeTone, string> = {
  success: "success.main",
  warning: "warning.main",
  info: "info.main",
  destructive: "error.main",
  secondary: "secondary.main",
  default: "primary.main",
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  tone = "default",
}: KpiCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
        >
          {/* Filled brand avatar */}
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: AVATAR_BG[tone],
              color: "#FFFFFF",
              width: 48,
              height: 48,
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            <Icon size={22} />
          </Avatar>

          {/* Label + value */}
          <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {label}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ fontWeight: 700, lineHeight: 1.2 }}
            >
              {value}
            </Typography>
            {delta && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {delta}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
