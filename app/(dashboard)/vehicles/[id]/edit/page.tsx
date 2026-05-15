import { notFound } from "next/navigation";

import Stack from "@mui/material/Stack";

import { PageHeader } from "@/components/crm/page-header";
import { listDriversForSelect } from "@/lib/data/drivers";
import { getVehicle } from "@/lib/data/vehicles";

import { VehicleFormPage } from "../../_components/vehicle-form-page";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditVehiclePage({ params }: PageProps) {
  const { id } = await params;
  const [vehicle, driverOptions] = await Promise.all([
    getVehicle(id),
    listDriversForSelect(),
  ]);

  if (!vehicle) {
    notFound();
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title={`Зміна авто · ${vehicle.plate} · ${vehicle.unit}`}
        backHref="/vehicles"
        backLabel="До списку"
      />
      <VehicleFormPage
        mode="edit"
        vehicle={vehicle}
        driverOptions={driverOptions}
      />
    </Stack>
  );
}
