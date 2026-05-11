import { deleteOrderAction } from "@/actions/orders";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_TONES,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/constants";
import type { OrderRow, OrderWithMetrics } from "@/lib/data/orders";
import { formatNumber, formatPercent, formatUah } from "@/lib/format";

import { OrderFormDialog } from "./order-form-dialog";

type ClientOption = { id: string; name: string; code: string };
type RouteOption = { id: string; name: string };
type DriverOption = { id: string; full_name: string };
type VehicleOption = { id: string; unit: string; plate: string };

type OrdersTableProps = {
  rows: OrderWithMetrics[];
  clients: ClientOption[];
  routes: RouteOption[];
  drivers: DriverOption[];
  vehicles: VehicleOption[];
};

export function OrdersTable({
  rows,
  clients,
  routes,
  drivers,
  vehicles,
}: OrdersTableProps) {
  if (rows.length === 0) {
    return (
      <div className="panel-card flex flex-col items-center gap-2 p-10 text-center">
        <p className="text-base font-medium">Замовлень ще немає</p>
        <p className="text-sm text-muted-foreground">
          Натисніть «Нове замовлення», щоб зареєструвати перший рейс.
        </p>
      </div>
    );
  }

  return (
    <div className="panel-card overflow-x-auto">
      <table className="w-full min-w-[1400px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/70 bg-surface/80 text-left">
            <Th>№</Th>
            <Th>Замовник</Th>
            <Th>Маршрут</Th>
            <Th>Водій</Th>
            <Th>Авто</Th>
            <Th>Об&apos;єм</Th>
            <Th>Ціна</Th>
            <Th>Оплата</Th>
            <Th>ДП</Th>
            <Th>Рентаб.</Th>
            <Th>Прибуток</Th>
            <Th>Статус</Th>
            <Th className="text-right">Дії</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = row.status as OrderStatus | null;
            const paymentStatus = row.payment_status as PaymentStatus | null;
            return (
              <tr
                key={row.id ?? row.number ?? ""}
                className="border-b border-border/50 last:border-b-0 hover:bg-surface/50"
              >
                <Td className="font-mono">{row.number}</Td>
                <Td>
                  <div className="font-medium">{row.client_name}</div>
                  <div className="text-xs text-muted-foreground">{row.client_code}</div>
                </Td>
                <Td>{row.route_name ?? "—"}</Td>
                <Td>{row.driver_full_name ?? "—"}</Td>
                <Td>
                  {row.vehicle_plate ? (
                    <>
                      <div className="font-mono">{row.vehicle_plate}</div>
                      <div className="text-xs text-muted-foreground">{row.vehicle_unit}</div>
                    </>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>{row.volume_tons != null ? `${formatNumber(row.volume_tons, 1)} т` : "—"}</Td>
                <Td>{formatUah(row.price_uah)}</Td>
                <Td>
                  {paymentStatus && (
                    <StatusBadge
                      label={PAYMENT_STATUS_LABELS[paymentStatus]}
                      tone={PAYMENT_STATUS_TONES[paymentStatus]}
                    />
                  )}
                </Td>
                <Td>{formatUah(row.fuel_cost_uah)}</Td>
                <Td>
                  <span className={cellTone(row.profitability_pct)}>
                    {formatPercent(row.profitability_pct)}
                  </span>
                </Td>
                <Td>{formatUah(row.actual_profit_uah)}</Td>
                <Td>
                  {status && (
                    <StatusBadge
                      label={ORDER_STATUS_LABELS[status]}
                      tone={ORDER_STATUS_TONES[status]}
                    />
                  )}
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <OrderFormDialog
                      mode="edit"
                      order={row as unknown as OrderRow}
                      clients={clients}
                      routes={routes}
                      drivers={drivers}
                      vehicles={vehicles}
                    />
                    <ConfirmDeleteDialog
                      title="Видалити замовлення?"
                      description={`Замовлення №${row.number} буде видалено.`}
                      action={deleteOrderAction}
                      id={row.id!}
                    />
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function cellTone(pct: number | null | undefined) {
  if (pct == null) return "";
  if (pct >= 15) return "text-success font-medium";
  if (pct >= 5) return "text-info";
  return "text-warning";
}

function Th({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <th
      className={`whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${className ?? ""}`}
    >
      {children}
    </th>
  );
}

function Td({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <td className={`whitespace-nowrap px-3 py-3 align-top ${className ?? ""}`}>
      {children}
    </td>
  );
}
