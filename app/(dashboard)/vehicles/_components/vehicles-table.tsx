import { BookOpen, Pencil } from "lucide-react";
import Link from "next/link";

import { deleteVehicleAction } from "@/actions/vehicles";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { StatusBadge } from "@/components/crm/status-badge";
import { Button } from "@/components/ui/button";
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUS_TONES,
  type VehicleStatus,
} from "@/lib/constants";
import type { VehicleWithStats } from "@/lib/data/vehicles";
import { formatDate, formatLiters, formatNumber } from "@/lib/format";

type VehiclesTableProps = {
  rows: VehicleWithStats[];
};

export function VehiclesTable({ rows }: VehiclesTableProps) {
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
            <th className="hidden md:table-cell">Держномер</th>
            <th className="hidden md:table-cell">Водій</th>
            <th className="hidden text-right md:table-cell">Розхід</th>
            <th className="hidden md:table-cell">Наступний сервіс</th>
            <th className="hidden text-right md:table-cell">Одометр</th>
            <th>Статус</th>
            <th className="hidden md:table-cell">Примітки</th>
            <th className="text-right">Дії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = row.status as VehicleStatus | null;
            return (
              <tr key={row.id ?? row.plate ?? ""}>
                <td className="font-medium text-foreground">
                  <div>{row.unit}</div>
                  <div className="mt-1 space-y-0.5 text-xs text-muted-foreground md:hidden">
                    <div className="font-mono">{row.plate}</div>
                    {row.driver_full_name && <div>{row.driver_full_name}</div>}
                  </div>
                </td>
                <td className="hidden font-mono md:table-cell">{row.plate}</td>
                <td className="hidden md:table-cell">
                  {row.driver_full_name ?? (
                    <span className="text-muted-foreground">Не закріплено</span>
                  )}
                </td>
                <td className="hidden text-right tabular-nums md:table-cell">
                  {row.fuel_norm_l_100km ? formatLiters(row.fuel_norm_l_100km, true) : "—"}
                </td>
                <td className="hidden text-muted-foreground md:table-cell">
                  {row.service_next_date ? formatDate(row.service_next_date) : "—"}
                </td>
                <td className="hidden text-right tabular-nums text-muted-foreground md:table-cell">
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
                <td className="hidden max-w-[260px] truncate text-muted-foreground md:table-cell" title={row.notes ?? undefined}>
                  {row.notes ?? "—"}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {row.id && (
                      <>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Сервісна книга"
                        >
                          <Link href={`/vehicles/${row.id}/service-book`}>
                            <BookOpen className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Редагувати"
                        >
                          <Link href={`/vehicles/${row.id}/edit`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                      </>
                    )}
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
