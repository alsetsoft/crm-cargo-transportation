import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listAvailableVehicles } from "@/lib/data/vehicles";

import { DriverFormPage } from "../_components/driver-form-page";

export const dynamic = "force-dynamic";

export default async function NewDriverPage() {
  const vehicleOptions = await listAvailableVehicles();

  return (
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Автопарк · Водії</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Новий водій
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Картка водія з прив&apos;язкою до авто та поточним статусом.
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

      <DriverFormPage mode="create" vehicleOptions={vehicleOptions} />
    </>
  );
}
