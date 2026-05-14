import { Plus } from "lucide-react";
import Link from "next/link";

import { ModulePage } from "@/components/crm/module-page";
import { Button } from "@/components/ui/button";
import { listActiveClients } from "@/lib/data/clients";
import { listDriversForSelect } from "@/lib/data/drivers";
import { listOrderExpensesByOrderId, listOrders } from "@/lib/data/orders";
import { listAvailableVehicles } from "@/lib/data/vehicles";

import { OrdersTable } from "./_components/orders-table";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [rows, clients, drivers, vehicles, expensesByOrderId] =
    await Promise.all([
      listOrders({ limit: 100 }),
      listActiveClients(),
      listDriversForSelect(),
      listAvailableVehicles(),
      listOrderExpensesByOrderId(),
    ]);

  return (
    <ModulePage
      eyebrow="Операційний журнал · Замовлення"
      title="Журнал замовлень"
      description="Реєстрація рейсів з прив'язкою клієнта, водія та авто. Рентабельність розраховується автоматично."
      actions={
        clients.length === 0 ? (
          <Button disabled>
            <Plus className="size-4" />
            Нове замовлення
          </Button>
        ) : (
          <Button asChild>
            <Link href="/orders/new">
              <Plus className="size-4" />
              Нове замовлення
            </Link>
          </Button>
        )
      }
    >
      <OrdersTable
        rows={rows}
        clients={clients}
        drivers={drivers}
        vehicles={vehicles}
        expensesByOrderId={expensesByOrderId}
      />
    </ModulePage>
  );
}
