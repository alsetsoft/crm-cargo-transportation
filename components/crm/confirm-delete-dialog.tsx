"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDeleteDialogProps = {
  title: string;
  description: string;
  action: (id: string) => Promise<{ ok: boolean; error?: string }>;
  id: string;
  triggerLabel?: string;
  triggerVariant?: "destructive" | "ghost" | "outline";
};

export function ConfirmDeleteDialog({
  title,
  description,
  action,
  id,
  triggerLabel,
  triggerVariant = "ghost",
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await action(id);
      if (result.ok) {
        toast.success("Запис видалено");
        setOpen(false);
      } else {
        toast.error(result.error ?? "Не вдалося видалити запис");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={triggerVariant} size="icon-sm" aria-label="Видалити">
          {triggerLabel ? (
            <>
              <Trash2 className="size-4" />
              <span>{triggerLabel}</span>
            </>
          ) : (
            <Trash2 className="size-4 text-destructive" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Скасувати</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Видалення..." : "Видалити"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
