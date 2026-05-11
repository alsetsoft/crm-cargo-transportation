import { deleteRouteAction } from "@/actions/routes";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  ROUTE_STATUS_LABELS,
  ROUTE_STATUS_TONES,
  type RouteStatus,
} from "@/lib/constants";
import type { RouteRow } from "@/lib/data/routes";
import { formatKm, formatNumber } from "@/lib/format";

import { RouteFormDialog } from "./route-form-dialog";

type RoutesTableProps = {
  rows: RouteRow[];
};

export function RoutesTable({ rows }: RoutesTableProps) {
  if (rows.length === 0) {
    return (
      <div className="panel-card flex flex-col items-center gap-2 p-10 text-center">
        <p className="text-base font-medium">Маршрутів ще немає</p>
        <p className="text-sm text-muted-foreground">
          Натисніть «Новий маршрут», щоб додати першу точку А → точка Б.
        </p>
      </div>
    );
  }

  return (
    <div className="panel-card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th className="hidden md:table-cell">Точка А</th>
            <th className="hidden md:table-cell">Точка Б</th>
            <th className="text-right">Відстань</th>
            <th className="hidden text-right md:table-cell">Час, год</th>
            <th>Статус</th>
            <th className="hidden md:table-cell">Примітки</th>
            <th className="text-right">Дії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="font-medium text-foreground">
                <div>{row.name}</div>
                <div className="mt-1 text-xs text-muted-foreground md:hidden">
                  {row.point_a} → {row.point_b}
                </div>
              </td>
              <td className="hidden md:table-cell">{row.point_a}</td>
              <td className="hidden md:table-cell">{row.point_b}</td>
              <td className="text-right tabular-nums">{formatKm(row.distance_km)}</td>
              <td className="hidden text-right tabular-nums md:table-cell">
                {row.typical_duration_hours ? formatNumber(row.typical_duration_hours, 1) : "—"}
              </td>
              <td>
                <StatusBadge
                  label={ROUTE_STATUS_LABELS[row.status as RouteStatus]}
                  tone={ROUTE_STATUS_TONES[row.status as RouteStatus]}
                />
              </td>
              <td className="hidden max-w-[260px] truncate text-muted-foreground md:table-cell" title={row.notes ?? undefined}>
                {row.notes ?? "—"}
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <RouteFormDialog mode="edit" route={row} />
                  <ConfirmDeleteDialog
                    title="Видалити маршрут?"
                    description={`Маршрут «${row.name}» буде видалено. Цю дію не можна скасувати.`}
                    action={deleteRouteAction}
                    id={row.id}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
