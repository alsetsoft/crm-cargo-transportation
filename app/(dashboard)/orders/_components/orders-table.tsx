"use client";

import { Pencil } from "lucide-react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
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

import { deleteOrderAction } from "@/actions/orders";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { LinkBehavior } from "@/components/crm/link-behavior";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_TONES,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/constants";
import type { OrderWithMetrics } from "@/lib/data/orders";
import { formatNumber, formatPercent, formatUah } from "@/lib/format";

type OrdersTableProps = {
  rows: OrderWithMetrics[];
};

// In MUI X v7 auto-height mode (`getRowHeight: () => 'auto'`) cells are
// rendered with `align-items: flex-start`, so taller content (e.g. the
// actions IconButton stack) sits at the cell top while shorter Typography
// cells render at their own geometric center — making action icons appear
// below the surrounding row data. Theme overrides lose the specificity
// battle, so each renderCell wraps its content in this Box, which uses
// `alignSelf: stretch` to fill the row's height and centers its child
// vertically with `alignItems: center`.
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
        justifyContent: align === "right" ? "flex-end" : "flex-start",
      }}
    >
      {children}
    </Box>
  );
}

function formatRoute(
  loading: string | null | undefined,
  unloading: string | null | undefined,
): string {
  const from = loading?.trim();
  const to = unloading?.trim();
  if (from && to) return `${from} → ${to}`;
  if (from) return from;
  if (to) return to;
  return "—";
}

export function OrdersTable({ rows }: OrdersTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

  const columnVisibilityModel: GridColumnVisibilityModel = {
    number: !isMobile,
    route: !isMobile,
    driver_full_name: !isMobile,
    vehicle: !isMobile,
    distance_km: !isMobile,
    price_per_km_uah: !isMobile,
    payment_status: !isMobile,
    fuel_cost_uah: !isMobile,
    profitability_pct: !isMobile,
    actual_profit_uah: !isMobile,
    status: !isPhone,
    // On phones price moves into the client cell's caption to free up width.
    price_uah: !isPhone,
  };

  const columns: GridColDef<OrderWithMetrics>[] = [
    {
      field: "number",
      headerName: "№",
      width: 90,
      renderCell: ({ value }) => (
        <CellRow>
          <Typography
            variant="body2"
            sx={{ fontFamily: "monospace", color: "text.secondary" }}
          >
            {value}
          </Typography>
        </CellRow>
      ),
    },
    {
      field: "client_name",
      headerName: "Замовник",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => (
        <CellRow>
          <Stack spacing={0.25}>
            <Typography variant="body2" fontWeight={500}>
              {row.client_name ?? "—"}
            </Typography>
            {row.client_code && (
              <Typography variant="caption" color="text.secondary">
                {row.client_code}
              </Typography>
            )}
            {isMobile && (
              <Typography variant="caption" color="text.secondary">
                {formatRoute(row.loading_place, row.unloading_place)}
                {row.driver_full_name ? ` · ${row.driver_full_name}` : ""}
              </Typography>
            )}
          </Stack>
        </CellRow>
      ),
    },
    {
      field: "route",
      headerName: "Маршрут",
      flex: 1,
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <CellRow>
          <Typography variant="body2" color="text.secondary">
            {formatRoute(row.loading_place, row.unloading_place)}
          </Typography>
        </CellRow>
      ),
    },
    {
      field: "driver_full_name",
      headerName: "Водій",
      width: 160,
      renderCell: ({ value }) => (
        <CellRow>
          <Typography variant="body2">{value ?? "—"}</Typography>
        </CellRow>
      ),
    },
    {
      field: "vehicle",
      headerName: "Авто",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) =>
        row.vehicle_plate ? (
          <CellRow>
            <Stack spacing={0}>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {row.vehicle_plate}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.vehicle_unit}
              </Typography>
            </Stack>
          </CellRow>
        ) : (
          <CellRow>
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          </CellRow>
        ),
    },
    {
      field: "distance_km",
      headerName: "Км",
      width: 100,
      type: "number",
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <CellRow align="right">
          <Typography
            variant="body2"
            sx={{ fontVariantNumeric: "tabular-nums" }}
          >
            {value != null ? `${formatNumber(value, 1)} км` : "—"}
          </Typography>
        </CellRow>
      ),
    },
    {
      field: "price_uah",
      headerName: "Ціна",
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
      field: "price_per_km_uah",
      headerName: "₴/км",
      width: 110,
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
      field: "payment_status",
      headerName: "Оплата",
      width: 130,
      sortable: false,
      renderCell: ({ value }) => {
        const ps = value as PaymentStatus | null;
        if (!ps) return null;
        return (
          <CellRow>
            <StatusBadge
              label={PAYMENT_STATUS_LABELS[ps]}
              tone={PAYMENT_STATUS_TONES[ps]}
            />
          </CellRow>
        );
      },
    },
    {
      field: "fuel_cost_uah",
      headerName: "ДП",
      width: 110,
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
      field: "profitability_pct",
      headerName: "Рентаб.",
      width: 100,
      type: "number",
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => {
        const pct = value as number | null | undefined;
        let color: string = "text.primary";
        if (pct != null) {
          if (pct >= 15) color = "success.main";
          else if (pct >= 5) color = "info.main";
          else color = "warning.main";
        }
        return (
          <CellRow align="right">
            <Typography
              variant="body2"
              sx={{
                fontVariantNumeric: "tabular-nums",
                color,
                fontWeight: pct != null && pct >= 15 ? 500 : 400,
              }}
            >
              {formatPercent(pct)}
            </Typography>
          </CellRow>
        );
      },
    },
    {
      field: "actual_profit_uah",
      headerName: "Прибуток",
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
      field: "status",
      headerName: "Статус",
      width: 130,
      sortable: false,
      renderCell: ({ value }) => {
        const s = value as OrderStatus | null;
        if (!s) return null;
        return (
          <CellRow>
            <StatusBadge
              label={ORDER_STATUS_LABELS[s]}
              tone={ORDER_STATUS_TONES[s]}
            />
          </CellRow>
        );
      },
    },
    {
      field: "actions",
      headerName: "Дії",
      width: 96,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <CellRow>
          <Stack direction="row" alignItems="center">
            {row.id && (
              <IconButton
                component={LinkBehavior}
                href={`/orders/${row.id}/edit`}
                aria-label="Редагувати"
              >
                <Pencil size={18} />
              </IconButton>
            )}
            <ConfirmDeleteDialog
              title="Видалити замовлення?"
              description={`Замовлення №${row.number} буде видалено.`}
              action={deleteOrderAction}
              id={row.id!}
            />
          </Stack>
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
              Замовлень ще немає
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Натисніть «Нове замовлення», щоб зареєструвати перший рейс.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // ── Mobile (< md): card list. Avoids the horizontal scroll DataGrid
  // forces on narrow viewports — actions sit on their own row inside
  // the card so they're always discoverable.
  if (isMobile) {
    return (
      <Stack spacing={1.5}>
        {rows.map((row) => {
          const status = row.status as OrderStatus | null;
          return (
            <Card key={row.id ?? row.number ?? ""} variant="outlined">
              <CardContent sx={{ pb: 1 }}>
                {/* Top row: № + status */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      color: "text.secondary",
                    }}
                  >
                    №{row.number}
                  </Typography>
                  {status && (
                    <StatusBadge
                      label={ORDER_STATUS_LABELS[status]}
                      tone={ORDER_STATUS_TONES[status]}
                    />
                  )}
                </Stack>

                {/* Client */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {row.client_name ?? "—"}
                </Typography>
                {row.client_code && (
                  <Typography variant="caption" color="text.secondary">
                    {row.client_code}
                  </Typography>
                )}

                {/* Route + driver */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.75 }}
                >
                  {formatRoute(row.loading_place, row.unloading_place)}
                </Typography>
                {row.driver_full_name && (
                  <Typography variant="caption" color="text.secondary">
                    Водій: {row.driver_full_name}
                  </Typography>
                )}

                {/* Price */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatUah(row.price_uah)}
                </Typography>
              </CardContent>

              <Divider />

              {/* Actions row — always visible, on its own line */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ px: 1.5, py: 1 }}
              >
                {row.id ? (
                  <Button
                    component={LinkBehavior}
                    href={`/orders/${row.id}/edit`}
                    variant="text"
                    size="medium"
                    startIcon={<Pencil size={16} />}
                  >
                    Редагувати
                  </Button>
                ) : (
                  <Box />
                )}
                <ConfirmDeleteDialog
                  title="Видалити замовлення?"
                  description={`Замовлення №${row.number} буде видалено.`}
                  action={deleteOrderAction}
                  id={row.id!}
                  triggerLabel="Видалити"
                  triggerVariant="ghost"
                />
              </Stack>
            </Card>
          );
        })}
      </Stack>
    );
  }

  // ── Desktop (md+): DataGrid table.
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id ?? row.number ?? ""}
            columnVisibilityModel={columnVisibilityModel}
            disableRowSelectionOnClick
            autoHeight
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
