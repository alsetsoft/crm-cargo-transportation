"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataGrid,
  type GridColDef,
  type GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { StatusBadge } from "@/components/crm/status-badge";
import type { BadgeTone } from "@/lib/constants";
import type { AuditLogRow } from "@/lib/data/audit-logs";
import { formatDateTime } from "@/lib/format";

const ENTITY_LABELS: Record<string, string> = {
  client: "Клієнт",
  driver: "Водій",
  vehicle: "Авто",
  order: "Замовлення",
  expense: "Витрата",
  service_procedure: "Сервісна процедура",
  service_record: "Виконання процедури",
};

const ACTION_LABELS: Record<string, string> = {
  created: "Створено",
  updated: "Оновлено",
  deleted: "Видалено",
  completed: "Виконано",
  reverted: "Скасовано",
};

const ACTION_TONES: Record<string, BadgeTone> = {
  created: "success",
  updated: "info",
  deleted: "destructive",
  completed: "success",
  reverted: "warning",
};

function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

function actionTone(action: string): BadgeTone {
  return ACTION_TONES[action] ?? "secondary";
}

function entityLabel(type: string): string {
  return ENTITY_LABELS[type] ?? type;
}

type LogsTableProps = {
  rows: AuditLogRow[];
};

export function LogsTable({ rows }: LogsTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

  const columnVisibilityModel: GridColumnVisibilityModel = {
    description: !isMobile,
    entity_type: !isPhone,
  };

  const columns: GridColDef<AuditLogRow>[] = [
    {
      field: "created_at",
      headerName: "Час",
      width: 200,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}
        >
          {formatDateTime(value)}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Дія",
      width: 130,
      sortable: false,
      renderCell: ({ value }) => (
        <StatusBadge
          label={actionLabel(value as string)}
          tone={actionTone(value as string)}
        />
      ),
    },
    {
      field: "entity_type",
      headerName: "Тип",
      width: 160,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography variant="body2" color="text.secondary">
          {entityLabel(value as string)}
        </Typography>
      ),
    },
    {
      field: "entity_label",
      headerName: "Об'єкт",
      flex: 1,
      minWidth: 140,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={500}>
          {(value as string | null) ?? "—"}
        </Typography>
      ),
    },
    {
      field: "description",
      headerName: "Деталі",
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {(value as string | null) ?? "—"}
        </Typography>
      ),
    },
  ];

  if (rows.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Логів ще немає
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Журнал заповниться після першої зміни в системі.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            columnVisibilityModel={columnVisibilityModel}
            disableRowSelectionOnClick
            autoHeight
            pageSizeOptions={[25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
              sorting: {
                sortModel: [{ field: "created_at", sort: "desc" }],
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
