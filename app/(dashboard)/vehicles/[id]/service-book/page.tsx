import { notFound } from "next/navigation";

import Stack from "@mui/material/Stack";

import { PageHeader } from "@/components/crm/page-header";
import { listServiceProceduresForVehicle } from "@/lib/data/service-procedures";
import { getVehicle } from "@/lib/data/vehicles";

import { ServiceBookTable } from "./_components/service-book-table";
import { ServiceProcedureAddForm } from "./_components/service-procedure-add-form";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function VehicleServiceBookPage({ params }: PageProps) {
  const { id } = await params;
  const [vehicle, procedures] = await Promise.all([
    getVehicle(id),
    listServiceProceduresForVehicle(id),
  ]);

  if (!vehicle) {
    notFound();
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title={`Сервісна книга · ${vehicle.plate} · ${vehicle.unit}`}
        backHref="/vehicles"
        backLabel="До списку"
      />

      <ServiceProcedureAddForm vehicleId={id} />

      <ServiceBookTable
        rows={procedures.rows}
        vehicleCurrentOdometer={procedures.vehicleCurrentOdometer}
      />
    </Stack>
  );
}
