import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Автопарк · Водії</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Редагувати водія
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {driver.full_name}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
          <Button variant="outline" asChild>
            <Link href="/drivers">
              <ArrowLeft className="size-4" />
              До списку
            </Link>
          </Button>
        </div>
      </section>

      <DriverFormPage
        mode="edit"
        driver={driver}
        vehicleOptions={vehicleOptions}
      />
    </>
  );
}
