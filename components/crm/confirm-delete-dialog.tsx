"use client";

import { useTransition } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Trash2 } from "lucide-react";

import { toast } from "@/lib/toast";

type ConfirmDeleteDialogProps = {
  title: string;
  description: string;
  action: (id: string) => Promise<{ ok: boolean; error?: string }>;
  id: string;
  triggerLabel?: string;
  triggerVariant?: "destructive" | "ghost" | "outline";
  // When the dialog's IconButton trigger sits next to a `Button size="small"`
  // (e.g. in the service-procedures actions cell), pass `size="small"` so
  // both controls share the same height and stay on a common centre line.
  // Defaults to medium for the DataGrid action cells used throughout the
  // rest of the app — touch targets there must stay ≥ 40px.
  size?: "small" | "medium";
};

// Map the legacy shadcn triggerVariant to MUI Button variant
type MuiVariant = "contained" | "text" | "outlined";

const TRIGGER_VARIANT_MAP: Record<
  NonNullable<ConfirmDeleteDialogProps["triggerVariant"]>,
  MuiVariant
> = {
  destructive: "contained",
  ghost: "text",
  outline: "outlined",
};

export function ConfirmDeleteDialog({
  title,
  description,
  action,
  id,
  triggerLabel,
  triggerVariant = "ghost",
  size = "medium",
}: ConfirmDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm(`${title}\n\n${description}`)) return;
    startTransition(async () => {
      const result = await action(id);
      if (result.ok) {
        toast.success("Запис видалено");
      } else {
        toast.error(result.error ?? "Не вдалося видалити запис");
      }
    });
  };

  if (triggerLabel) {
    return (
      <Button
        color="error"
        variant={TRIGGER_VARIANT_MAP[triggerVariant]}
        startIcon={<Trash2 size={16} />}
        onClick={handleClick}
        disabled={isPending}
      >
        {triggerLabel}
      </Button>
    );
  }

  return (
    <IconButton
      aria-label="Видалити"
      color="error"
      onClick={handleClick}
      disabled={isPending}
      size={size}
      sx={size === "medium" ? { p: 1.5 } : undefined}
    >
      <Trash2 size={size === "small" ? 16 : 18} />
    </IconButton>
  );
}
