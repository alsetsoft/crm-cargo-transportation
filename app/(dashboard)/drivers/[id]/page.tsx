import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/crm/status-badge";
import { Badge } from "@/components/ui/badge";
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
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Автопарк · Водій</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              {driver.full_name}
            </h1>
            {driver.phone && (
              <p className="text-sm text-muted-foreground sm:text-base">
                {driver.phone}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
          <StatusBadge
            label={DRIVER_STATUS_LABELS[status]}
            tone={DRIVER_STATUS_TONES[status]}
          />
          <Button variant="outline" asChild>
            <Link href={`/drivers/${driver.id}/edit`}>
              <Pencil className="size-4" />
              Редагувати
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/drivers">
              <ArrowLeft className="size-4" />
              До списку
            </Link>
          </Button>
        </div>
      </section>

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
