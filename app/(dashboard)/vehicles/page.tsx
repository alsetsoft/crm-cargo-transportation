import MuiButton from "@mui/material/Button";
import { Plus } from "lucide-react";

import { ModulePage } from "@/components/crm/module-page";
import { listVehicles } from "@/lib/data/vehicles";

import { VehiclesTable } from "./_components/vehicles-table";

export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  const rows = await listVehicles();

  return (
    <ModulePage
      eyebrow="Автопарк · Авто"
      title="Автомобілі"
      description="Картки ТЗ з технічними характеристиками та нормативами розходу. Сервісна книга — окремо на кожному авто."
      actions={
        <MuiButton
          href="/vehicles/new"
          variant="contained"
          size="large"
          startIcon={<Plus size={18} />}
        >
          Нове авто
        </MuiButton>
      }
    >
      <VehiclesTable rows={rows} />
    </ModulePage>
  );
}
