import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listActiveClients } from "@/lib/data/clients";
import { listDriversForSelect } from "@/lib/data/drivers";
import { getOrderWithExpenses } from "@/lib/data/orders";
import { listAvailableVehicles } from "@/lib/data/vehicles";

import { OrderFormPage } from "../../_components/order-form-page";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditOrderPage({ params }: PageProps) {
  const { id } = await params;
  const [orderData, clients, drivers, vehicles] = await Promise.all([
    getOrderWithExpenses(id),
    listActiveClients(),
    listDriversForSelect(),
    listAvailableVehicles(),
  ]);

  if (!orderData) {
    notFound();
  }

  return (
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Операційний журнал · Замовлення</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Редагувати замовлення №{orderData.order.number}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Інформація, фінанси та операційні дані рейсу.
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

      <OrderFormPage
        mode="edit"
        order={orderData.order}
        expenses={orderData.expenses}
        clients={clients}
        drivers={drivers}
        vehicles={vehicles}
      />
    </>
  );
}
