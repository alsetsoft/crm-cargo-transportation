import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Автопарк · Сервісна книга</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Сервісна книга
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

      <ServiceProcedureAddForm vehicleId={id} />

      <ServiceBookTable
        rows={procedures.rows}
        vehicleCurrentOdometer={procedures.vehicleCurrentOdometer}
      />
    </>
  );
}
