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
import { deleteRouteAction } from "@/actions/routes";

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
    <div className="stack-table">
      <div className="stack-header grid-cols-[1.4fr_1.4fr_0.7fr_0.7fr_0.8fr_120px]">
        <div>Назва</div>
        <div>Точки</div>
        <div>Відстань</div>
        <div>Час, год</div>
        <div>Статус</div>
        <div className="text-right">Дії</div>
      </div>
      {rows.map((row) => (
        <div
          key={row.id}
          className="stack-row md:grid-cols-[1.4fr_1.4fr_0.7fr_0.7fr_0.8fr_120px]"
        >
          <div>
            <span className="stack-label">Назва</span>
            <div className="font-medium text-foreground">{row.name}</div>
            {row.notes && (
              <p className="text-xs text-muted-foreground">{row.notes}</p>
            )}
          </div>
          <div>
            <span className="stack-label">Точки</span>
            <div className="text-sm">
              {row.point_a} <span className="text-muted-foreground">→</span> {row.point_b}
            </div>
          </div>
          <div>
            <span className="stack-label">Відстань</span>
            <div>{formatKm(row.distance_km)}</div>
          </div>
          <div>
            <span className="stack-label">Час</span>
            <div>{row.typical_duration_hours ? formatNumber(row.typical_duration_hours, 1) : "—"}</div>
          </div>
          <div>
            <span className="stack-label">Статус</span>
            <StatusBadge
              label={ROUTE_STATUS_LABELS[row.status as RouteStatus]}
              tone={ROUTE_STATUS_TONES[row.status as RouteStatus]}
            />
          </div>
          <div className="flex items-center justify-end gap-1">
            <RouteFormDialog mode="edit" route={row} />
            <ConfirmDeleteDialog
              title="Видалити маршрут?"
              description={`Маршрут «${row.name}» буде видалено. Цю дію не можна скасувати.`}
              action={deleteRouteAction}
              id={row.id}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
