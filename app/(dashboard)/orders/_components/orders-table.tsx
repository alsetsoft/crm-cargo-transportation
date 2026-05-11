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
      <table className="data-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Замовник</th>
            <th>Маршрут</th>
            <th>Водій</th>
            <th>Авто</th>
            <th className="text-right">Об&apos;єм</th>
            <th className="text-right">Ціна</th>
            <th>Оплата</th>
            <th className="text-right">ДП</th>
            <th className="text-right">Рентаб.</th>
            <th className="text-right">Прибуток</th>
            <th>Статус</th>
            <th className="text-right">Дії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = row.status as OrderStatus | null;
            const paymentStatus = row.payment_status as PaymentStatus | null;
            return (
              <tr key={row.id ?? row.number ?? ""}>
                <td className="font-mono">{row.number}</td>
                <td>
                  <div className="font-medium">{row.client_name}</div>
                  <div className="text-xs text-muted-foreground">{row.client_code}</div>
                </td>
                <td>{row.route_name ?? "—"}</td>
                <td>{row.driver_full_name ?? "—"}</td>
                <td>
                  {row.vehicle_plate ? (
                    <>
                      <div className="font-mono">{row.vehicle_plate}</div>
                      <div className="text-xs text-muted-foreground">{row.vehicle_unit}</div>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="text-right tabular-nums">
                  {row.volume_tons != null ? `${formatNumber(row.volume_tons, 1)} т` : "—"}
                </td>
                <td className="text-right tabular-nums">{formatUah(row.price_uah)}</td>
                <td>
                  {paymentStatus && (
                    <StatusBadge
                      label={PAYMENT_STATUS_LABELS[paymentStatus]}
                      tone={PAYMENT_STATUS_TONES[paymentStatus]}
                    />
                  )}
                </td>
                <td className="text-right tabular-nums">{formatUah(row.fuel_cost_uah)}</td>
                <td className="text-right tabular-nums">
                  <span className={cellTone(row.profitability_pct)}>
                    {formatPercent(row.profitability_pct)}
                  </span>
                </td>
                <td className="text-right tabular-nums">{formatUah(row.actual_profit_uah)}</td>
                <td>
                  {status && (
                    <StatusBadge
                      label={ORDER_STATUS_LABELS[status]}
                      tone={ORDER_STATUS_TONES[status]}
                    />
                  )}
                </td>
                <td className="text-right">
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
                </td>
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
