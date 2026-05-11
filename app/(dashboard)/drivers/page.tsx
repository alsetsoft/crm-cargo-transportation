import { ModulePage } from "@/components/crm/module-page";
import { listDrivers } from "@/lib/data/drivers";
import { listAvailableVehicles } from "@/lib/data/vehicles";

import { DriverFormDialog } from "./_components/driver-form-dialog";
import { DriversTable } from "./_components/drivers-table";

export const dynamic = "force-dynamic";

export default async function DriversPage() {
  const [rows, vehicleOptions] = await Promise.all([
    listDrivers(),
    listAvailableVehicles(),
  ]);

  return (
    <ModulePage
      eyebrow="Автопарк · Водії"
      title="Водії"
      description="Облік водійського складу: статус, прив'язка до авто, рейтинг ефективності."
      actions={
        <DriverFormDialog mode="create" vehicleOptions={vehicleOptions} />
      }
    >
      <DriversTable rows={rows} vehicleOptions={vehicleOptions} />
    </ModulePage>
  );
}
