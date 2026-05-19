import Stack from "@mui/material/Stack";

import { PageHeader } from "@/components/crm/page-header";
import { listDriversForSelect } from "@/lib/data/drivers";
import { listTrackerOptions } from "@/lib/data/gps";

import { VehicleFormPage } from "../_components/vehicle-form-page";

export const dynamic = "force-dynamic";

export default async function NewVehiclePage() {
  const [driverOptions, trackerOptions] = await Promise.all([
    listDriversForSelect(),
    listTrackerOptions(),
  ]);

  return (
    <Stack spacing={3}>
      <PageHeader title="Нове авто" backHref="/vehicles" backLabel="До списку" />
      <VehicleFormPage
        mode="create"
        driverOptions={driverOptions}
        trackerOptions={trackerOptions}
      />
    </Stack>
  );
}
