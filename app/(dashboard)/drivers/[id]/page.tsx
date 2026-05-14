import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/crm/page-header";
import { StatusBadge } from "@/components/crm/status-badge";
import { Button } from "@/components/ui/button";
import {
  DRIVER_STATUS_LABELS,
  DRIVER_STATUS_TONES,
  type DriverStatus,
} from "@/lib/constants";
import { getDriver, listDrivers } from "@/lib/data/drivers";
import { listOrdersForDriver } from "@/lib/data/orders";
import { formatNumber, formatUahPrecise } from "@/lib/format";

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
    <>
      <PageHeader
        title={driver.full_name}
        backHref="/drivers"
        backLabel="До списку"
        actions={
          <>
            <StatusBadge
              label={DRIVER_STATUS_LABELS[status]}
              tone={DRIVER_STATUS_TONES[status]}
            />
            <Button variant="outline" size="sm" asChild>
              <Link href={`/drivers/${driver.id}/edit`}>
                <Pencil className="size-4" />
                Редагувати
              </Link>
            </Button>
          </>
        }
      />

      <section className="kpi-grid">
        <div className="panel-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Рейсів
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {ordersCount}
          </div>
        </div>
        <div className="panel-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Рейтинг
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {driver.rating != null ? formatNumber(driver.rating, 1) : "—"}
          </div>
        </div>
        <div className="panel-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Комісія, ₴/км
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {driver.commission_per_km_uah != null
              ? formatUahPrecise(driver.commission_per_km_uah)
              : "—"}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Історія поїздок</h2>
        <OrdersTable rows={orders} />
      </section>

      {driver.notes && (
        <section className="panel-card p-5">
          <h2 className="section-title mb-2">Примітки</h2>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {driver.notes}
          </p>
        </section>
      )}
    </>
  );
}
