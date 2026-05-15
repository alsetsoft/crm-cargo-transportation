import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type ModulePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function ModulePage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: ModulePageProps) {
  return (
    <Stack spacing={{ xs: 2, sm: 3 }}>
      {/* Hero */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-end" },
          justifyContent: "space-between",
          gap: 2,
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ maxWidth: 720 }}>
          <Chip
            label={eyebrow}
            size="small"
            sx={{
              mb: 1.5,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: 24,
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 1, lineHeight: 1.2 }}
          >
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Box>

        {actions && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ flexShrink: 0, flexWrap: "wrap" }}
          >
            {actions}
          </Stack>
        )}
      </Box>

      {/* Page content */}
      {children}
    </Stack>
  );
}
