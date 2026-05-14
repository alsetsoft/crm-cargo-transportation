"use client";

import { Check, CheckCircle2, X } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  deleteServiceProcedureAction,
  markServiceProcedureDoneAction,
  undoServiceProcedureAction,
} from "@/actions/service-procedures";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ServiceProcedureActionsProps = {
  procedureId: string;
  canUndo: boolean;
};

export function ServiceProcedureActions({
  procedureId,
  canUndo,
}: ServiceProcedureActionsProps) {
  const [isPending, startTransition] = useTransition();

  const markDone = () => {
    startTransition(async () => {
      const result = await markServiceProcedureDoneAction(procedureId);
      if (result.ok) toast.success("Процедуру позначено як виконану");
      else toast.error(result.error);
    });
  };

  const undoLast = () => {
    startTransition(async () => {
      const result = await undoServiceProcedureAction(procedureId);
      if (result.ok) toast.success("Останнє виконання скасовано");
      else toast.error(result.error);
    });
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" disabled={isPending}>
            <CheckCircle2 className="size-4" />
            Виконано
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem onSelect={markDone} disabled={isPending}>
            <Check className="size-4 text-success" />
            Виконано
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={undoLast}
            disabled={isPending || !canUndo}
          >
            <X className="size-4 text-warning" />
            Скасувати останнє
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => event.preventDefault()}
            className="text-muted-foreground"
          >
            Скасувати
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDeleteDialog
        title="Видалити процедуру?"
        description="Процедуру та всі її записи про виконання буде видалено."
        action={deleteServiceProcedureAction}
        id={procedureId}
        triggerVariant="ghost"
      />
    </div>
  );
}
