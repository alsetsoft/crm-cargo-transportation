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
import type {
  OrderExpenseRow,
  OrderRow,
  OrderWithMetrics,
} from "@/lib/data/orders";
import { formatNumber, formatPercent, formatUah } from "@/lib/format";

import { OrderFormDialog } from "./order-form-dialog";

type ClientOption = { id: string; name: string; code: string };
type DriverOption = {
  id: string;
  full_name: string;
  commission_per_km_uah: number;
};
type VehicleOption = { id: string; unit: string; plate: string };

type OrdersTableProps = {
  rows: OrderWithMetrics[];
  clients: ClientOption[];
  drivers: DriverOption[];
  vehicles: VehicleOption[];
  expensesByOrderId?: Record<string, OrderExpenseRow[]>;
};

export function OrdersTable({
  rows,
  clients,
  drivers,
  vehicles,
  expensesByOrderId = {},
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
            <th className="hidden md:table-cell">№</th>
            <th>Замовник</th>
            <th className="hidden md:table-cell">Маршрут</th>
            <th className="hidden md:table-cell">Водій</th>
            <th className="hidden md:table-cell">Авто</th>
            <th className="hidden text-right md:table-cell">Км</th>
            <th className="text-right">Ціна</th>
            <th className="hidden text-right md:table-cell">₴/км</th>
            <th className="hidden md:table-cell">Оплата</th>
            <th className="hidden text-right md:table-cell">ДП</th>
            <th className="hidden text-right md:table-cell">Рентаб.</th>
            <th className="hidden text-right md:table-cell">Прибуток</th>
            <th>Статус</th>
            <th className="text-right">Дії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = row.status as OrderStatus | null;
            const paymentStatus = row.payment_status as PaymentStatus | null;
            const expenses = row.id ? (expensesByOrderId[row.id] ?? []) : [];
            const routeText = formatRoute(row.loading_place, row.unloading_place);
            return (
              <tr key={row.id ?? row.number ?? ""}>
                <td className="hidden font-mono md:table-cell">{row.number}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-muted-foreground md:hidden">№{row.number}</span>
                    <span className="font-medium">{row.client_name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{row.client_code}</div>
                  <div className="mt-1 text-xs text-muted-foreground md:hidden">
                    {routeText} · {row.driver_full_name ?? "Без водія"}
                  </div>
                </td>
                <td className="hidden md:table-cell">{routeText}</td>
                <td className="hidden md:table-cell">{row.driver_full_name ?? "—"}</td>
                <td className="hidden md:table-cell">
                  {row.vehicle_plate ? (
                    <>
                      <div className="font-mono">{row.vehicle_plate}</div>
                      <div className="text-xs text-muted-foreground">{row.vehicle_unit}</div>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="hidden text-right tabular-nums md:table-cell">
                  {row.distance_km != null ? `${formatNumber(row.distance_km, 1)} км` : "—"}
                </td>
                <td className="text-right tabular-nums">{formatUah(row.price_uah)}</td>
                <td className="hidden text-right tabular-nums md:table-cell">
                  {formatUah(row.price_per_km_uah)}
                </td>
                <td className="hidden md:table-cell">
                  {paymentStatus && (
                    <StatusBadge
                      label={PAYMENT_STATUS_LABELS[paymentStatus]}
                      tone={PAYMENT_STATUS_TONES[paymentStatus]}
                    />
                  )}
                </td>
                <td className="hidden text-right tabular-nums md:table-cell">{formatUah(row.fuel_cost_uah)}</td>
                <td className="hidden text-right tabular-nums md:table-cell">
                  <span className={cellTone(row.profitability_pct)}>
                    {formatPercent(row.profitability_pct)}
                  </span>
                </td>
                <td className="hidden text-right tabular-nums md:table-cell">{formatUah(row.actual_profit_uah)}</td>
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
                      order={row as unknown as OrderRow}
                      expenses={expenses}
                      clients={clients}
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
