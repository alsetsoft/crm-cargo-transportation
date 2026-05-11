import { deleteVehicleAction } from "@/actions/vehicles";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUS_TONES,
  type VehicleStatus,
} from "@/lib/constants";
import type { VehicleRow, VehicleWithStats } from "@/lib/data/vehicles";
import { formatDate, formatLiters, formatNumber } from "@/lib/format";

import { VehicleFormDialog } from "./vehicle-form-dialog";

type DriverOption = { id: string; full_name: string };

type VehiclesTableProps = {
  rows: VehicleWithStats[];
  driverOptions: DriverOption[];
};

export function VehiclesTable({ rows, driverOptions }: VehiclesTableProps) {
  if (rows.length === 0) {
    return (
      <div className="panel-card flex flex-col items-center gap-2 p-10 text-center">
        <p className="text-base font-medium">Авто у автопарку немає</p>
        <p className="text-sm text-muted-foreground">
          Додайте перше авто з марками, держномером і нормативом розходу.
        </p>
      </div>
    );
  }

  return (
    <div className="panel-card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Авто</th>
            <th>Держномер</th>
            <th>Водій</th>
            <th className="text-right">Розхід</th>
            <th>Наступний сервіс</th>
            <th className="text-right">Одометр</th>
            <th>Статус</th>
            <th>Примітки</th>
            <th className="text-right">Дії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = row.status as VehicleStatus | null;
            return (
              <tr key={row.id ?? row.plate ?? ""}>
                <td className="font-medium text-foreground">{row.unit}</td>
                <td className="font-mono">{row.plate}</td>
                <td>
                  {row.driver_full_name ?? (
                    <span className="text-muted-foreground">Не закріплено</span>
                  )}
                </td>
                <td className="text-right tabular-nums">
                  {row.fuel_norm_l_100km ? formatLiters(row.fuel_norm_l_100km, true) : "—"}
                </td>
                <td className="text-muted-foreground">
                  {row.service_next_date ? formatDate(row.service_next_date) : "—"}
                </td>
                <td className="text-right tabular-nums text-muted-foreground">
                  {row.service_next_odometer
                    ? `${formatNumber(row.service_next_odometer)} км`
                    : "—"}
                </td>
                <td>
                  {status && (
                    <StatusBadge
                      label={VEHICLE_STATUS_LABELS[status]}
                      tone={VEHICLE_STATUS_TONES[status]}
                    />
                  )}
                </td>
                <td className="max-w-[260px] truncate text-muted-foreground" title={row.notes ?? undefined}>
                  {row.notes ?? "—"}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <VehicleFormDialog
                      mode="edit"
                      vehicle={row as unknown as VehicleRow}
                      driverOptions={driverOptions}
                    />
                    <ConfirmDeleteDialog
                      title="Видалити авто?"
                      description={`Авто ${row.plate} буде видалено. Якщо за ним закріплені замовлення — посилання знімуться.`}
                      action={deleteVehicleAction}
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
