import {
  Building2,
  ClipboardList,
  Truck,
  UserRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { KpiCard } from "@/components/crm/kpi-card";
import { ModulePage } from "@/components/crm/module-page";
import { StatusBadge } from "@/components/crm/status-badge";
import { Button } from "@/components/ui/button";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  type OrderStatus,
} from "@/lib/constants";
import { getDebtorClients } from "@/lib/data/clients";
import { getDashboardKpi } from "@/lib/data/dashboard";
import { listOrders } from "@/lib/data/orders";
import { formatNumber, formatUah } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [kpi, latestOrders, debtors] = await Promise.all([
    getDashboardKpi(),
    listOrders({ limit: 5 }),
    getDebtorClients(5),
  ]);

  return (
    <ModulePage
      eyebrow="VlasnaCRM · Етап 1"
      title="Аналітика автопарку"
      description="Базовий облік рейсів: ключові метрики, останні замовлення та клієнти з заборгованістю."
      actions={
        <Button asChild variant="panel">
          <Link href="/orders">Перейти до журналу</Link>
        </Button>
      }
    >
      <section className="kpi-grid">
        <KpiCard
          label="Активні замовлення"
          value={formatNumber(kpi.activeOrders)}
          icon={ClipboardList}
          delta="Нові + в процесі"
          tone="info"
        />
        <KpiCard
          label="Авто в рейсі"
          value={formatNumber(kpi.vehiclesOnTrip)}
          icon={Truck}
          delta="Зайнятий рухомий склад"
          tone="warning"
        />
        <KpiCard
          label="Доступні водії"
          value={formatNumber(kpi.driversAvailable)}
          icon={UserRound}
          delta="Готові до виїзду"
          tone="success"
        />
        <KpiCard
          label="Оборот за місяць"
          value={formatUah(kpi.monthlyRevenue)}
          icon={Wallet}
          delta="Сума за поточний місяць"
          tone="info"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="panel-card overflow-hidden">
          <header className="flex items-center justify-between border-b border-border/70 px-5 py-4">
            <div>
              <h2 className="section-title">Останні замовлення</h2>
              <p className="text-xs text-muted-foreground">
                Найновіші 5 рейсів — швидкий огляд завантаженості.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/orders">Всі</Link>
            </Button>
          </header>
          {latestOrders.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              Замовлень ще немає — створіть перше на сторінці «Замовлення».
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {latestOrders.map((row) => {
                const status = row.status as OrderStatus | null;
                return (
                  <li
                    key={row.id ?? row.number ?? ""}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-5 py-3 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground">№{row.number}</span>
                        <span className="truncate font-medium text-foreground">{row.client_name}</span>
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {row.route_name ?? "Без маршруту"} · {row.driver_full_name ?? "Без водія"}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-medium">{formatUah(row.price_uah)}</span>
                      {status && (
                        <StatusBadge
                          label={ORDER_STATUS_LABELS[status]}
                          tone={ORDER_STATUS_TONES[status]}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="panel-card overflow-hidden">
          <header className="flex items-center justify-between border-b border-border/70 px-5 py-4">
            <div>
              <h2 className="section-title">Заборгованість клієнтів</h2>
              <p className="text-xs text-muted-foreground">
                ТОП-5 за сумою боргу — кому нагадати про оплату.
              </p>
            </div>
            <Building2 className="size-5 text-primary" />
          </header>
          {debtors.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              Немає клієнтів з заборгованістю.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {debtors.map((c) => (
                <li
                  key={c.id ?? c.code ?? ""}
                  className="flex items-center justify-between gap-3 px-5 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{c.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.code}</div>
                  </div>
                  <span className="shrink-0 font-semibold text-warning">{formatUah(c.debt_uah)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </ModulePage>
  );
}
