import MuiButton from "@mui/material/Button";
import { Pencil, TrendingUp, Truck } from "lucide-react";
import { notFound } from "next/navigation";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { KpiCard } from "@/components/crm/kpi-card";
import { ModulePage } from "@/components/crm/module-page";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  DRIVER_STATUS_LABELS,
  DRIVER_STATUS_TONES,
  type DriverStatus,
} from "@/lib/constants";
import { getDriver, listDrivers } from "@/lib/data/drivers";
import { listOrdersForDriver } from "@/lib/data/orders";
import { formatUahPrecise } from "@/lib/format";

import { OrdersTable } from "../../orders/_components/orders-table";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function DriverDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [driver, stats, orders] = await Promise.all([
    getDriver(id),
    listDrivers(),
    listOrdersForDriver(id, 100),
  ]);

  if (!driver) {
    notFound();
  }

  const driverStats = stats.find((d) => d.id === id);
  const status = driver.status as DriverStatus;
  const ordersCount = driverStats?.orders_count ?? orders.length;

  return (
    <ModulePage
      eyebrow={`Водій · ${driver.full_name}`}
      title={driver.full_name}
      description="Картка водія та історія поїздок."
      actions={
        <Stack direction="row" spacing={1.5} alignItems="center">
          <StatusBadge
            label={DRIVER_STATUS_LABELS[status]}
            tone={DRIVER_STATUS_TONES[status]}
          />
          <MuiButton
            href={`/drivers/${driver.id}/edit`}
            variant="outlined"
            startIcon={<Pencil size={16} />}
          >
            Редагувати
          </MuiButton>
        </Stack>
      }
    >
      {/* KPI grid */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <KpiCard
            label="Рейсів"
            value={String(ordersCount)}
            icon={Truck}
            tone="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <KpiCard
            label="Комісія, ₴/км"
            value={
              driver.commission_per_km_uah != null
                ? formatUahPrecise(driver.commission_per_km_uah)
                : "—"
            }
            icon={TrendingUp}
            tone="success"
          />
        </Grid>
      </Grid>

      {/* Trip history */}
      <Stack spacing={1.5}>
        <Typography variant="h6" component="h2">
          Історія поїздок
        </Typography>
        <OrdersTable rows={orders} />
      </Stack>

      {/* Notes */}
      {driver.notes && (
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Примітки
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "pre-wrap" }}
            >
              {driver.notes}
            </Typography>
          </CardContent>
        </Card>
      )}
    </ModulePage>
  );
}
