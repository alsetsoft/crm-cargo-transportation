import { notFound } from "next/navigation";

import Stack from "@mui/material/Stack";

import { PageHeader } from "@/components/crm/page-header";
import { getDriver } from "@/lib/data/drivers";
import { listAvailableVehicles } from "@/lib/data/vehicles";

import { DriverFormPage } from "../../_components/driver-form-page";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditDriverPage({ params }: PageProps) {
  const { id } = await params;
  const [driver, vehicleOptions] = await Promise.all([
    getDriver(id),
    listAvailableVehicles(),
  ]);

  if (!driver) {
    notFound();
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title={`Зміна водія · ${driver.full_name}`}
        backHref="/drivers"
        backLabel="До списку"
      />
      <DriverFormPage
        mode="edit"
        driver={driver}
        vehicleOptions={vehicleOptions}
      />
    </Stack>
  );
}
