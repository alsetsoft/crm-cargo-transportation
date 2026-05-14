import { StatusBadge } from "@/components/crm/status-badge";
import {
  VEHICLE_DOCUMENT_TYPE_LABELS,
  type BadgeTone,
} from "@/lib/constants";
import type {
  ServiceProcedureStatus,
  ServiceProcedureView,
} from "@/lib/data/service-procedures";
import { formatDate, formatNumber } from "@/lib/format";

import { ServiceProcedureActions } from "./service-procedure-actions";

type ServiceBookTableProps = {
  rows: ServiceProcedureView[];
  vehicleCurrentOdometer: number;
};

const STATUS_LABELS: Record<ServiceProcedureStatus, string> = {
  ok: "В нормі",
  due_soon: "Скоро",
  overdue: "Прострочено",
  unknown: "Не виконувалось",
};

const STATUS_TONES: Record<ServiceProcedureStatus, BadgeTone> = {
  ok: "success",
  due_soon: "warning",
  overdue: "destructive",
  unknown: "secondary",
};

function formatPeriod(km: number | null, days: number | null): string {
  const parts: string[] = [];
  if (km != null) parts.push(`${formatNumber(km)} км`);
  if (days != null) parts.push(`${formatNumber(days)} дн`);
  return parts.join(" / ") || "—";
}

function formatRemaining(
  km: number | null,
  days: number | null,
  status: ServiceProcedureStatus,
): string {
  if (status === "unknown") return "—";
  const parts: string[] = [];
  if (km != null) parts.push(`${formatNumber(km)} км`);
  if (days != null) parts.push(`${formatNumber(days)} дн`);
  return parts.join(" / ") || "—";
}

export function ServiceBookTable({
  rows,
  vehicleCurrentOdometer,
}: ServiceBookTableProps) {
  if (rows.length === 0) {
    return (
      <div className="panel-card flex flex-col items-center gap-2 p-10 text-center">
        <p className="text-base font-medium">Процедур ще немає</p>
        <p className="text-sm text-muted-foreground">
          Додайте першу процедуру обслуговування — наприклад, ТО кожні 10000 км.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="panel-card flex items-center justify-between px-5 py-3 text-sm">
        <span className="text-muted-foreground">Поточний пробіг авто</span>
        <span className="font-medium tabular-nums">
          {vehicleCurrentOdometer > 0
            ? `${formatNumber(vehicleCurrentOdometer)} км`
            : "—"}
        </span>
      </div>
      <div className="panel-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Процедура</th>
              <th className="hidden md:table-cell">Період</th>
              <th className="hidden md:table-cell">Останнє виконання</th>
              <th className="hidden text-right md:table-cell">Пробіг</th>
              <th className="hidden text-right md:table-cell">Залишок</th>
              <th>Статус</th>
              <th className="text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="font-medium text-foreground">
                  <div>{VEHICLE_DOCUMENT_TYPE_LABELS[row.type]}</div>
                  {row.notes && (
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {row.notes}
                    </div>
                  )}
                  <div className="mt-1 space-y-0.5 text-xs text-muted-foreground md:hidden">
                    <div>Період: {formatPeriod(row.period_km, row.period_days)}</div>
                    {row.last_completed_at && (
                      <div>
                        Виконано: {formatDate(row.last_completed_at)}
                        {row.last_odometer != null
                          ? ` · ${formatNumber(row.last_odometer)} км`
                          : ""}
                      </div>
                    )}
                    <div>
                      Залишок:{" "}
                      {formatRemaining(row.remaining_km, row.remaining_days, row.status)}
                    </div>
                  </div>
                </td>
                <td className="hidden tabular-nums md:table-cell">
                  {formatPeriod(row.period_km, row.period_days)}
                </td>
                <td className="hidden text-muted-foreground tabular-nums md:table-cell">
                  {row.last_completed_at ? formatDate(row.last_completed_at) : "—"}
                </td>
                <td className="hidden text-right tabular-nums md:table-cell">
                  {row.last_odometer != null
                    ? `${formatNumber(row.last_odometer)} км`
                    : "—"}
                </td>
                <td className="hidden text-right tabular-nums md:table-cell">
                  <span className={remainingTone(row)}>
                    {formatRemaining(row.remaining_km, row.remaining_days, row.status)}
                  </span>
                </td>
                <td>
                  <StatusBadge
                    label={STATUS_LABELS[row.status]}
                    tone={STATUS_TONES[row.status]}
                  />
                </td>
                <td className="text-right">
                  <ServiceProcedureActions
                    procedureId={row.id}
                    canUndo={row.records_count > 0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function remainingTone(row: ServiceProcedureView): string {
  if (row.status === "overdue") return "text-destructive font-medium";
  if (row.status === "due_soon") return "text-warning font-medium";
  return "";
}
