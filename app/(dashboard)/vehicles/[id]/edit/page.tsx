import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Автопарк · Авто</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Редагувати авто
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {vehicle.plate} · {vehicle.unit}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
          <Button variant="outline" asChild>
            <Link href="/vehicles">
              <ArrowLeft className="size-4" />
              До списку
            </Link>
          </Button>
        </div>
      </section>

      <VehicleFormPage
        mode="edit"
        vehicle={vehicle}
        driverOptions={driverOptions}
      />
    </>
  );
}
