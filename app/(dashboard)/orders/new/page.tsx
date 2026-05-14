import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listActiveClients } from "@/lib/data/clients";
import { listDriversForSelect } from "@/lib/data/drivers";
import { suggestNextOrderNumber } from "@/lib/data/orders";
import { listAvailableVehicles } from "@/lib/data/vehicles";

import { OrderFormPage } from "../_components/order-form-page";

export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
  const [clients, drivers, vehicles, defaultNumber] = await Promise.all([
    listActiveClients(),
    listDriversForSelect(),
    listAvailableVehicles(),
    suggestNextOrderNumber(),
  ]);

  return (
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Операційний журнал · Замовлення</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Нове замовлення
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Інформація, фінанси та операційні дані рейсу. Рентабельність
              розраховується автоматично.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
          <Button variant="outline" asChild>
            <Link href="/orders">
              <ArrowLeft className="size-4" />
              До журналу
            </Link>
          </Button>
        </div>
      </section>

      {clients.length === 0 ? (
        <p className="rounded-xl border border-dashed border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
          Спочатку додайте принаймні одного клієнта на сторінці «Клієнти».
        </p>
      ) : (
        <OrderFormPage
          mode="create"
          defaultNumber={defaultNumber}
          clients={clients}
          drivers={drivers}
          vehicles={vehicles}
        />
      )}
    </>
  );
}
