import { ModulePage } from "@/components/crm/module-page";
import { listDriversForSelect } from "@/lib/data/drivers";
import {
  listVehicleDocumentsByVehicleId,
  listVehicles,
} from "@/lib/data/vehicles";

import { VehicleFormDialog } from "./_components/vehicle-form-dialog";
import { VehiclesTable } from "./_components/vehicles-table";

export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  const [rows, driverOptions, documentsByVehicleId] = await Promise.all([
    listVehicles(),
    listDriversForSelect(),
    listVehicleDocumentsByVehicleId(),
  ]);

  return (
    <ModulePage
      eyebrow="Автопарк · Авто"
      title="Автомобілі"
      description="Картки ТЗ з технічними характеристиками, нормативами розходу та документами."
      actions={
        <VehicleFormDialog mode="create" driverOptions={driverOptions} />
      }
    >
      <VehiclesTable
        rows={rows}
        driverOptions={driverOptions}
        documentsByVehicleId={documentsByVehicleId}
      />
    </ModulePage>
  );
}
