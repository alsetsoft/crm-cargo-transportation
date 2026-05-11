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
    <div className="stack-table">
      <div className="stack-header grid-cols-[1.4fr_1fr_1.2fr_0.8fr_0.8fr_0.8fr_120px]">
        <div>Авто</div>
        <div>Держномер</div>
        <div>Водій</div>
        <div>Розхід</div>
        <div>Сервіс</div>
        <div>Статус</div>
        <div className="text-right">Дії</div>
      </div>
      {rows.map((row) => {
        const status = row.status as VehicleStatus | null;
        return (
          <div
            key={row.id ?? row.plate ?? ""}
            className="stack-row md:grid-cols-[1.4fr_1fr_1.2fr_0.8fr_0.8fr_0.8fr_120px]"
          >
            <div>
              <span className="stack-label">Авто</span>
              <div className="font-medium text-foreground">{row.unit}</div>
              {row.notes && (
                <p className="text-xs text-muted-foreground">{row.notes}</p>
              )}
            </div>
            <div className="font-mono">
              <span className="stack-label">Держномер</span>
              {row.plate}
            </div>
            <div className="text-sm">
              <span className="stack-label">Водій</span>
              {row.driver_full_name ?? (
                <span className="text-muted-foreground">Не закріплено</span>
              )}
            </div>
            <div>
              <span className="stack-label">Розхід</span>
              {row.fuel_norm_l_100km ? formatLiters(row.fuel_norm_l_100km, true) : "—"}
            </div>
            <div className="text-sm">
              <span className="stack-label">Сервіс</span>
              {row.service_next_date && <div>{formatDate(row.service_next_date)}</div>}
              {row.service_next_odometer && (
                <div className="text-muted-foreground">
                  {formatNumber(row.service_next_odometer)} км
                </div>
              )}
              {!row.service_next_date && !row.service_next_odometer && "—"}
            </div>
            <div>
              <span className="stack-label">Статус</span>
              {status && (
                <StatusBadge
                  label={VEHICLE_STATUS_LABELS[status]}
                  tone={VEHICLE_STATUS_TONES[status]}
                />
              )}
            </div>
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
          </div>
        );
      })}
    </div>
  );
}
