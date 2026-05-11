import { deleteDriverAction } from "@/actions/drivers";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  DRIVER_STATUS_LABELS,
  DRIVER_STATUS_TONES,
  type DriverStatus,
} from "@/lib/constants";
import type { DriverRow, DriverWithStats } from "@/lib/data/drivers";
import { formatNumber } from "@/lib/format";

import { DriverFormDialog } from "./driver-form-dialog";

type VehicleOption = { id: string; unit: string; plate: string };

type DriversTableProps = {
  rows: DriverWithStats[];
  vehicleOptions: VehicleOption[];
};

export function DriversTable({ rows, vehicleOptions }: DriversTableProps) {
  if (rows.length === 0) {
    return (
      <div className="panel-card flex flex-col items-center gap-2 p-10 text-center">
        <p className="text-base font-medium">Водіїв ще немає</p>
        <p className="text-sm text-muted-foreground">
          Додайте першого водія, щоб призначати на рейси.
        </p>
      </div>
    );
  }

  return (
    <div className="panel-card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>ПІБ</th>
            <th>Телефон</th>
            <th>Авто</th>
            <th>Номер</th>
            <th className="text-right">Рейсів</th>
            <th className="text-right">Рейтинг</th>
            <th>Статус</th>
            <th>Примітки</th>
            <th className="text-right">Дії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = row.status as DriverStatus | null;
            return (
              <tr key={row.id ?? ""}>
                <td className="font-medium text-foreground">{row.full_name}</td>
                <td className="text-muted-foreground">{row.phone ?? "—"}</td>
                <td>
                  {row.vehicle_unit ?? (
                    <span className="text-muted-foreground">Не закріплено</span>
                  )}
                </td>
                <td className="font-mono text-muted-foreground">
                  {row.vehicle_plate ?? "—"}
                </td>
                <td className="text-right tabular-nums">{formatNumber(row.orders_count)}</td>
                <td className="text-right tabular-nums">
                  {row.rating != null ? formatNumber(row.rating, 1) : "—"}
                </td>
                <td>
                  {status && (
                    <StatusBadge
                      label={DRIVER_STATUS_LABELS[status]}
                      tone={DRIVER_STATUS_TONES[status]}
                    />
                  )}
                </td>
                <td className="max-w-[260px] truncate text-muted-foreground" title={row.notes ?? undefined}>
                  {row.notes ?? "—"}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <DriverFormDialog
                      mode="edit"
                      driver={row as unknown as DriverRow}
                      vehicleOptions={vehicleOptions}
                    />
                    <ConfirmDeleteDialog
                      title="Видалити водія?"
                      description={`Водія «${row.full_name}» буде видалено. Замовлення з ним перейдуть у статус без водія.`}
                      action={deleteDriverAction}
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
