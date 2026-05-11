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
    <div className="stack-table">
      <div className="stack-header grid-cols-[1.6fr_1.2fr_1.2fr_0.6fr_0.7fr_0.8fr_120px]">
        <div>ПІБ</div>
        <div>Телефон</div>
        <div>Авто</div>
        <div>Рейсів</div>
        <div>Рейтинг</div>
        <div>Статус</div>
        <div className="text-right">Дії</div>
      </div>
      {rows.map((row) => {
        const status = row.status as DriverStatus | null;
        return (
          <div
            key={row.id ?? ""}
            className="stack-row md:grid-cols-[1.6fr_1.2fr_1.2fr_0.6fr_0.7fr_0.8fr_120px]"
          >
            <div>
              <span className="stack-label">ПІБ</span>
              <div className="font-medium text-foreground">{row.full_name}</div>
              {row.notes && (
                <p className="text-xs text-muted-foreground">{row.notes}</p>
              )}
            </div>
            <div className="text-sm">
              <span className="stack-label">Телефон</span>
              {row.phone ?? "—"}
            </div>
            <div className="text-sm">
              <span className="stack-label">Авто</span>
              {row.vehicle_plate ? (
                <>
                  <div className="font-mono">{row.vehicle_plate}</div>
                  <div className="text-muted-foreground">{row.vehicle_unit}</div>
                </>
              ) : (
                <span className="text-muted-foreground">Не закріплено</span>
              )}
            </div>
            <div>
              <span className="stack-label">Рейсів</span>
              {formatNumber(row.orders_count)}
            </div>
            <div>
              <span className="stack-label">Рейтинг</span>
              {row.rating != null ? formatNumber(row.rating, 1) : "—"}
            </div>
            <div>
              <span className="stack-label">Статус</span>
              {status && (
                <StatusBadge
                  label={DRIVER_STATUS_LABELS[status]}
                  tone={DRIVER_STATUS_TONES[status]}
                />
              )}
            </div>
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
          </div>
        );
      })}
    </div>
  );
}
