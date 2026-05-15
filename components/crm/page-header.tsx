import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  backHref: string;
  backLabel?: string;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  backHref,
  backLabel = "Назад",
  actions,
}: PageHeaderProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      spacing={2}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{ minWidth: 0, flex: 1, wordBreak: "break-word" }}
      >
        {title}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
        {actions}
        <Button
          href={backHref}
          variant="outlined"
          size="medium"
          startIcon={<ArrowBackIcon />}
        >
          {backLabel}
        </Button>
      </Stack>
    </Stack>
  );
}
