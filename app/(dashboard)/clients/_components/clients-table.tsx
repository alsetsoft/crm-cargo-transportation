"use client";

import { History, Pencil } from "lucide-react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataGrid,
  type GridColDef,
  type GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { deleteClientAction } from "@/actions/clients";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { LinkBehavior } from "@/components/crm/link-behavior";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_TONES,
  type ClientStatus,
} from "@/lib/constants";
import type { ClientWithStats } from "@/lib/data/clients";
import { formatNumber, formatUah } from "@/lib/format";

type ClientsTableProps = {
  rows: ClientWithStats[];
};

export function ClientsTable({ rows }: ClientsTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // On phones (<sm) we also drop the status chip so the remaining
  // name + actions columns fit a 360–375px viewport without horizontal scroll.
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));
  const columnVisibilityModel: GridColumnVisibilityModel = {
    code: !isMobile,
    contact_person: !isMobile,
    phone: !isMobile,
    email: !isMobile,
    orders_count: !isMobile,
    turnover_uah: !isMobile,
    status: !isPhone,
  };

  const columns: GridColDef<ClientWithStats>[] = [
    {
      field: "code",
      headerName: "Код",
      width: 100,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{ fontFamily: "monospace", color: "text.secondary" }}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Назва",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Stack spacing={0.25} sx={{ py: 0.5 }}>
          <Link
            component={LinkBehavior}
            href={`/clients/${row.id}`}
            underline="hover"
            variant="body2"
            fontWeight={500}
            color="text.primary"
          >
            {row.name}
          </Link>
          {isMobile && row.phone && (
            <Typography variant="caption" color="text.secondary">
              {row.phone}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      field: "contact_person",
      headerName: "Контактна особа",
      width: 180,
      renderCell: ({ value }) => (
        <Typography variant="body2">{value ?? "—"}</Typography>
      ),
    },
    {
      field: "phone",
      headerName: "Телефон",
      width: 140,
      renderCell: ({ value }) => (
        <Typography variant="body2" color="text.secondary">
          {value ?? "—"}
        </Typography>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          color="text.secondary"
          title={value ?? undefined}
          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {value ?? "—"}
        </Typography>
      ),
    },
    {
      field: "orders_count",
      headerName: "Замовлень",
      width: 110,
      type: "number",
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {formatNumber(value)}
        </Typography>
      ),
    },
    {
      field: "turnover_uah",
      headerName: "Оборот",
      width: 140,
      type: "number",
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {formatUah(value)}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Статус",
      width: 140,
      sortable: false,
      renderCell: ({ value }) => {
        const status = value as ClientStatus | null;
        if (!status) return null;
        return (
          <StatusBadge
            label={CLIENT_STATUS_LABELS[status]}
            tone={CLIENT_STATUS_TONES[status]}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Дії",
      width: 120,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          {!isMobile && row.id && (
            <IconButton
              component={LinkBehavior}
              href={`/clients/${row.id}`}
              aria-label="Історія замовлень"
            >
              <History size={18} />
            </IconButton>
          )}
          {row.id && (
            <IconButton
              component={LinkBehavior}
              href={`/clients/${row.id}/edit`}
              aria-label="Редагувати"
            >
              <Pencil size={18} />
            </IconButton>
          )}
          <ConfirmDeleteDialog
            title="Видалити клієнта?"
            description={`Клієнта «${row.name}» буде видалено. Якщо за ним є замовлення — видалення не виконається.`}
            action={deleteClientAction}
            id={row.id!}
          />
        </Stack>
      ),
    },
  ];

  if (rows.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Клієнтів ще немає
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Створіть першого замовника, щоб можна було реєструвати замовлення.
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
            getRowId={(row) => row.id ?? row.code ?? ""}
            columnVisibilityModel={columnVisibilityModel}
            disableRowSelectionOnClick
            autoHeight
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
            sx={{ border: "none" }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
