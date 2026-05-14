import { Plus } from "lucide-react";
import Link from "next/link";

import { ModulePage } from "@/components/crm/module-page";
import { Button } from "@/components/ui/button";
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
        <Button asChild>
          <Link href="/vehicles/new">
            <Plus className="size-4" />
            Нове авто
          </Link>
        </Button>
      }
    >
      <VehiclesTable rows={rows} />
    </ModulePage>
  );
}
