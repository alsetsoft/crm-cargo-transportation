import { notFound } from "next/navigation";

import { ModulePage } from "@/components/crm/module-page";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_TONES,
  type ClientStatus,
} from "@/lib/constants";
import { getClient, listActiveClients, listClients } from "@/lib/data/clients";
import { listDriversForSelect } from "@/lib/data/drivers";
import {
  listOrderExpensesByOrderId,
  listOrdersForClient,
} from "@/lib/data/orders";
import { listAvailableVehicles } from "@/lib/data/vehicles";
import { formatUah } from "@/lib/format";

import { OrdersTable } from "../../orders/_components/orders-table";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  const [
    client,
    stats,
    orders,
    clients,
    drivers,
    vehicles,
    expensesByOrderId,
  ] = await Promise.all([
    getClient(id),
    listClients(),
    listOrdersForClient(id, 100),
    listActiveClients(),
    listDriversForSelect(),
    listAvailableVehicles(),
    listOrderExpensesByOrderId(),
  ]);

  if (!client) {
    notFound();
  }

  const clientStats = stats.find((c) => c.id === id);
  const status = client.status as ClientStatus;
  const ordersCount = clientStats?.orders_count ?? orders.length;
  const turnover = clientStats?.turnover_uah ?? 0;

  return (
    <ModulePage
      eyebrow={`Клієнт · ${client.code}`}
      title={client.name}
      description={
        client.contact_person
          ? `Контактна особа: ${client.contact_person}`
          : "Картка замовника та історія замовлень."
      }
      actions={
        <StatusBadge
          label={CLIENT_STATUS_LABELS[status]}
          tone={CLIENT_STATUS_TONES[status]}
        />
      }
    >
      <section className="kpi-grid">
        <div className="panel-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Замовлень
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {ordersCount}
          </div>
        </div>
        <div className="panel-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Оборот
          </div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {formatUah(turnover)}
          </div>
        </div>
        <div className="panel-card p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Контакти
          </div>
          <div className="mt-1 space-y-1 text-sm">
            <div>{client.phone ?? "—"}</div>
            <div className="text-muted-foreground">{client.email ?? "—"}</div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Історія замовлень</h2>
        <OrdersTable
          rows={orders}
          clients={clients}
          drivers={drivers}
          vehicles={vehicles}
          expensesByOrderId={expensesByOrderId}
        />
      </section>

      {client.notes && (
        <section className="panel-card p-5">
          <h2 className="section-title mb-2">Примітки</h2>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {client.notes}
          </p>
        </section>
      )}
    </ModulePage>
  );
}
