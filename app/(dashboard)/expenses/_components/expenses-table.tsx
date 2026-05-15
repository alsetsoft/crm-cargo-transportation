"use client";

import { Pencil } from "lucide-react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataGrid,
  type GridColDef,
  type GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { deleteExpenseAction } from "@/actions/expenses";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { LinkBehavior } from "@/components/crm/link-behavior";
import type { ExpenseListRow } from "@/lib/data/expenses";
import { formatDate, formatUah } from "@/lib/format";

type ExpensesTableProps = {
  rows: ExpenseListRow[];
};

const SOURCE_LABELS: Record<ExpenseListRow["source"], string> = {
  manual: "",
  fuel: "Пальне",
  commission: "Комісія",
};

export function ExpensesTable({ rows }: ExpensesTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const columnVisibilityModel: GridColumnVisibilityModel = {
    spent_at: !isMobile,
    order_number: !isMobile,
    notes: !isMobile,
  };

  const total = rows.reduce((sum, r) => sum + Number(r.amount_uah ?? 0), 0);

  const columns: GridColDef<ExpenseListRow>[] = [
    {
      field: "spent_at",
      headerName: "Дата",
      width: 130,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {formatDate(value)}
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
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" fontWeight={500}>
              {row.name}
            </Typography>
            {row.source !== "manual" && (
              <Chip
                label={SOURCE_LABELS[row.source]}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
          {isMobile && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatDate(row.spent_at)}
              {row.order_number
                ? ` · №${row.order_number}${row.client_name ? ` · ${row.client_name}` : ""}`
                : ""}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      field: "order_number",
      headerName: "Замовлення",
      width: 180,
      sortable: false,
      renderCell: ({ row }) =>
        row.order_number ? (
          <Stack spacing={0.25} sx={{ py: 0.5 }}>
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace" }}
            >
              №{row.order_number}
            </Typography>
            {row.client_name && (
              <Typography variant="caption" color="text.secondary">
                {row.client_name}
              </Typography>
            )}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
      field: "amount_uah",
      headerName: "Сума",
      width: 130,
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
      field: "notes",
      headerName: "Примітки",
      flex: 1,
      minWidth: 140,
      sortable: false,
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
      field: "actions",
      headerName: "Дії",
      width: 100,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) =>
        row.source === "manual" ? (
          <Stack direction="row" justifyContent="flex-end" alignItems="center">
            <IconButton
              component={LinkBehavior}
              href={`/expenses/${row.id}/edit`}
              aria-label="Редагувати"
            >
              <Pencil size={18} />
            </IconButton>
            <ConfirmDeleteDialog
              title="Видалити витрату?"
              description={`Витрату «${row.name}» буде видалено.`}
              action={deleteExpenseAction}
              id={row.id}
            />
          </Stack>
        ) : (
          <Typography
            variant="caption"
            color="text.secondary"
            title="Редагується у відповідному замовленні"
          >
            У замовленні
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
              Витрат ще немає
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Натисніть «Нова витрата», щоб додати першу.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={1.5}>
      {/* Summary bar */}
      <Card variant="outlined">
        <CardContent
          sx={{
            py: 1.5,
            px: 2.5,
            "&:last-child": { pb: 1.5 },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              Всього записів
            </Typography>
            <Stack direction="row" spacing={3} alignItems="center">
              <Typography
                variant="body2"
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {rows.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Сума:
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatUah(total)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Data grid */}
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
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25 },
                },
                sorting: {
                  sortModel: [{ field: "spent_at", sort: "desc" }],
                },
              }}
              sx={{ border: "none" }}
            />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
