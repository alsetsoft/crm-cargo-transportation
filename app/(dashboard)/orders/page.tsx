import { Plus } from "lucide-react";
import Link from "next/link";

import { ModulePage } from "@/components/crm/module-page";
import { Button } from "@/components/ui/button";
import { listActiveClients } from "@/lib/data/clients";
import { listOrders } from "@/lib/data/orders";

import { OrdersTable } from "./_components/orders-table";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [rows, clients] = await Promise.all([
    listOrders({ limit: 100 }),
    listActiveClients(),
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
      <OrdersTable rows={rows} />
    </ModulePage>
  );
}
