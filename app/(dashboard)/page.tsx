import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import {
  ArrowRight,
  ClipboardList,
  TrendingUp,
  Truck,
  Wallet,
} from "lucide-react";

import { KpiCard } from "@/components/crm/kpi-card";
import { ModulePage } from "@/components/crm/module-page";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  type OrderStatus,
} from "@/lib/constants";
import { getDashboardKpi } from "@/lib/data/dashboard";
import { listOrders } from "@/lib/data/orders";
import { formatDateTime, formatNumber, formatUah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [kpi, latestOrders] = await Promise.all([
    getDashboardKpi(),
    listOrders({ limit: 5 }),
  ]);

  return (
    <ModulePage
      eyebrow="VlasnaCRM"
      title="Аналітика"
      description="Загальний огляд операційних показників автопарку в реальному часі."
    >
      {/* KPI row */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Авто в рейсі"
            value={formatNumber(kpi.vehiclesOnTrip)}
            icon={Truck}
            tone="default"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Активні замовлення"
            value={formatNumber(kpi.activeOrders)}
            icon={ClipboardList}
            tone="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Доступні водії"
            value={formatNumber(kpi.driversAvailable)}
            icon={TrendingUp}
            tone="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Оборот за місяць"
            value={formatUah(kpi.monthlyRevenue)}
            icon={Wallet}
            tone="success"
          />
        </Grid>
      </Grid>

      {/* Last orders */}
      <Card variant="outlined">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ px: 2.5, py: 2 }}
        >
          <Typography variant="h6" component="h2">
            Останні замовлення
          </Typography>
          <Link
            href="/orders"
            underline="hover"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            Всі замовлення
            <ArrowRight size={16} />
          </Link>
        </Stack>

        {latestOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 3 }}>
            Замовлень ще немає — створіть перше на сторінці «Замовлення».
          </Typography>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "action.hover" }}>
                  <TableCell>№</TableCell>
                  <TableCell>Створено</TableCell>
                  <TableCell>Замовник</TableCell>
                  <TableCell>Водій</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Ціна</TableCell>
                  <TableCell align="right">Прибуток</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestOrders.map((row) => {
                  const status = row.status as OrderStatus | null;
                  return (
                    <TableRow
                      key={row.id ?? row.number ?? ""}
                      hover
                    >
                      <TableCell sx={{ fontFamily: "monospace" }}>
                        {row.number ?? "—"}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "text.secondary",
                          fontVariantNumeric: "tabular-nums",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.created_at ? formatDateTime(row.created_at) : "—"}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} noWrap>
                          {row.client_name ?? "—"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>
                        {row.driver_full_name ?? "—"}
                      </TableCell>
                      <TableCell>
                        {status && (
                          <StatusBadge
                            label={ORDER_STATUS_LABELS[status]}
                            tone={ORDER_STATUS_TONES[status]}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {formatUah(row.price_uah)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontVariantNumeric: "tabular-nums",
                          fontWeight: 600,
                          color:
                            (row.actual_profit_uah ?? 0) >= 0
                              ? "success.main"
                              : "error.main",
                        }}
                      >
                        {formatUah(row.actual_profit_uah)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {/* Tail spacing inside Card */}
        <Box sx={{ pb: 1 }} />
      </Card>
    </ModulePage>
  );
}
