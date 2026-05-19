"use client";

import { Check, CheckCircle2, X } from "lucide-react";
import { useState, useTransition } from "react";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

import {
  deleteServiceProcedureAction,
  markServiceProcedureDoneAction,
  undoServiceProcedureAction,
} from "@/actions/service-procedures";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { toast } from "@/lib/toast";

type ServiceProcedureActionsProps = {
  procedureId: string;
  canUndo: boolean;
};

export function ServiceProcedureActions({
  procedureId,
  canUndo,
}: ServiceProcedureActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const markDone = () => {
    setMenuAnchor(null);
    startTransition(async () => {
      const result = await markServiceProcedureDoneAction(procedureId);
      if (result.ok) toast.success("Процедуру позначено як виконану");
      else toast.error(result.error);
    });
  };

  const undoLast = () => {
    setMenuAnchor(null);
    startTransition(async () => {
      const result = await undoServiceProcedureAction(procedureId);
      if (result.ok) toast.success("Останнє виконання скасовано");
      else toast.error(result.error);
    });
  };

  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={0.5}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<CheckCircle2 size={16} />}
        disabled={isPending}
        onClick={(e) => setMenuAnchor(e.currentTarget)}
        aria-controls={menuOpen ? `actions-menu-${procedureId}` : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
      >
        Виконано
      </Button>
      <Menu
        id={`actions-menu-${procedureId}`}
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
        disableScrollLock
      >
        <MenuItem onClick={markDone} disabled={isPending}>
          <ListItemIcon sx={{ color: "success.main" }}>
            <Check size={16} />
          </ListItemIcon>
          <ListItemText>Виконано</ListItemText>
        </MenuItem>
        <MenuItem onClick={undoLast} disabled={isPending || !canUndo}>
          <ListItemIcon>
            <X size={16} />
          </ListItemIcon>
          <ListItemText>Скасувати останнє</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <ListItemText sx={{ color: "text.secondary" }}>Закрити</ListItemText>
        </MenuItem>
      </Menu>
      <ConfirmDeleteDialog
        title="Видалити процедуру?"
        description="Процедуру та всі її записи про виконання буде видалено."
        action={deleteServiceProcedureAction}
        id={procedureId}
        triggerVariant="ghost"
        size="small"
      />
    </Stack>
  );
}
