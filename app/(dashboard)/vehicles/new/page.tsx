import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listDriversForSelect } from "@/lib/data/drivers";

import { VehicleFormPage } from "../_components/vehicle-form-page";

export const dynamic = "force-dynamic";

export default async function NewVehiclePage() {
  const driverOptions = await listDriversForSelect();

  return (
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Автопарк · Авто</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Нове авто
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Технічна картка ТЗ з нормативом розходу та документами.
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

      <VehicleFormPage mode="create" driverOptions={driverOptions} />
    </>
  );
}
