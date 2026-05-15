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
      sx={{ p: 1.5 }}
    >
      <Trash2 size={18} />
    </IconButton>
  );
}
