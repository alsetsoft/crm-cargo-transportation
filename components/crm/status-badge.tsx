import Chip from "@mui/material/Chip";

import { TONE_TO_MUI_COLOR, type BadgeTone } from "@/lib/constants";

type StatusBadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function StatusBadge({ label, tone = "secondary" }: StatusBadgeProps) {
  return (
    <Chip
      label={label}
      size="small"
      color={TONE_TO_MUI_COLOR[tone]}
      variant="filled"
      sx={{ fontWeight: 500 }}
    />
  );
}
