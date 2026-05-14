import { PageHeader } from "@/components/crm/page-header";
import { listAvailableVehicles } from "@/lib/data/vehicles";

import { DriverFormPage } from "../_components/driver-form-page";

export const dynamic = "force-dynamic";

export default async function NewDriverPage() {
  const vehicleOptions = await listAvailableVehicles();

  return (
    <>
      <PageHeader title="Новий водій" backHref="/drivers" backLabel="До списку" />
      <DriverFormPage mode="create" vehicleOptions={vehicleOptions} />
    </>
  );
}
