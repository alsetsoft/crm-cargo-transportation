import { PageHeader } from "@/components/crm/page-header";
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
      <PageHeader title="Нове замовлення" backHref="/orders" backLabel="До журналу" />

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
