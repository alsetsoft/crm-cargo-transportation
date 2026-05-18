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

// Vertical-centering wrapper for DataGrid renderCell content. Box stretches
// to fill the cell's full height so its inner `alignItems: center` puts the
// content on the row's true geometric center — bypassing any internal MUI X
// v7 rule that pushes cells to `align-items: flex-start`.
type CellRowAlign = "left" | "right";
function CellRow({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: CellRowAlign;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        alignSelf: "stretch",
        width: "100%",
        height: "100%",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
      }}
    >
      {children}
    </Box>
  );
}

export function ExpensesTable({ rows }: ExpensesTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

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
        <CellRow>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatDate(value)}
          </Typography>
        </CellRow>
      ),
    },
    {
      field: "name",
      headerName: "Назва",
      flex: 1,
      minWidth: 220,
      renderCell: ({ row }) => (
        <CellRow>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              columnGap: 1,
              rowGap: 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ wordBreak: "break-word" }}
            >
              {row.name}
            </Typography>
            {row.source !== "manual" && (
              <Chip
                label={SOURCE_LABELS[row.source]}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </CellRow>
      ),
    },
    {
      field: "order_number",
      headerName: "Замовлення",
      width: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <CellRow>
          {row.order_number ? (
            <Stack spacing={0.25}>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
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
          )}
        </CellRow>
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
        <CellRow align="right">
          <Typography
            variant="body2"
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatUah(value)}
          </Typography>
        </CellRow>
      ),
    },
    {
      field: "notes",
      headerName: "Примітки",
      flex: 1,
      minWidth: 140,
      sortable: false,
      renderCell: ({ value }) => (
        <CellRow>
          <Typography
            variant="body2"
            color="text.secondary"
            title={value ?? undefined}
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {value ?? "—"}
          </Typography>
        </CellRow>
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
      renderCell: ({ row }) => (
        <CellRow align="right">
          {row.source === "manual" ? (
            <Stack direction="row" alignItems="center">
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
          )}
        </CellRow>
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
            px: { xs: 2, sm: 2.5 },
            "&:last-child": { pb: 1.5 },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={{ xs: 0.5, sm: 1.5 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="baseline">
              <Typography variant="body2" color="text.secondary">
                Всього записів:
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {rows.length}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="baseline">
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

      {isMobile ? (
        /* Mobile: stacked card list */
        <Stack spacing={1}>
          {rows.map((row) => {
            const orderLine = row.order_number
              ? `№${row.order_number}${row.client_name ? ` · ${row.client_name}` : ""}`
              : null;
            const metaLine = [formatDate(row.spent_at), orderLine]
              .filter(Boolean)
              .join(" · ");

            return (
              <Card key={row.id} variant="outlined">
                <CardContent
                  sx={{
                    p: 2,
                    "&:last-child": { pb: 2 },
                  }}
                >
                  <Stack spacing={0.75}>
                    {/* Title row: name (+ optional chip below) + amount */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={1.5}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            columnGap: 1,
                            rowGap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{ wordBreak: "break-word" }}
                          >
                            {row.name}
                          </Typography>
                          {row.source !== "manual" && (
                            <Chip
                              label={SOURCE_LABELS[row.source]}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{
                          fontVariantNumeric: "tabular-nums",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {formatUah(row.amount_uah)}
                      </Typography>
                    </Stack>

                    {/* Meta line: date · order · client */}
                    {metaLine && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontVariantNumeric: "tabular-nums",
                          wordBreak: "break-word",
                        }}
                      >
                        {metaLine}
                      </Typography>
                    )}

                    {/* Actions row */}
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                      sx={{ mt: 0.5 }}
                    >
                      {row.source === "manual" ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton
                            component={LinkBehavior}
                            href={`/expenses/${row.id}/edit`}
                            aria-label="Редагувати"
                            sx={{ p: 1.5 }}
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
                        <Typography variant="caption" color="text.secondary">
                          Редагується у замовленні
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      ) : (
        /* Desktop: DataGrid */
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
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
