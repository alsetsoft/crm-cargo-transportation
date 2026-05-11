import { ModulePage } from "@/components/crm/module-page";
import { listActiveClients } from "@/lib/data/clients";
import { listDriversForSelect } from "@/lib/data/drivers";
import { listOrders, suggestNextOrderNumber } from "@/lib/data/orders";
import { listActiveRoutes } from "@/lib/data/routes";
import { listAvailableVehicles } from "@/lib/data/vehicles";

import { OrderFormDialog } from "./_components/order-form-dialog";
import { OrdersTable } from "./_components/orders-table";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [rows, clients, routes, drivers, vehicles, defaultNumber] = await Promise.all([
    listOrders({ limit: 100 }),
    listActiveClients(),
    listActiveRoutes(),
    listDriversForSelect(),
    listAvailableVehicles(),
    suggestNextOrderNumber(),
  ]);

  return (
    <ModulePage
      eyebrow="Операційний журнал · Замовлення"
      title="Журнал замовлень"
      description="Реєстрація рейсів з прив'язкою клієнта, маршруту, водія та авто. Рентабельність розраховується автоматично."
      actions={
        <OrderFormDialog
          mode="create"
          defaultNumber={defaultNumber}
          clients={clients}
          routes={routes}
          drivers={drivers}
          vehicles={vehicles}
        />
      }
    >
      <OrdersTable
        rows={rows}
        clients={clients}
        routes={routes}
        drivers={drivers}
        vehicles={vehicles}
      />
    </ModulePage>
  );
}
