import MuiButton from "@mui/material/Button";
import { Plus } from "lucide-react";

import { ModulePage } from "@/components/crm/module-page";
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
          <MuiButton
            variant="contained"
            size="large"
            startIcon={<Plus size={18} />}
            disabled
          >
            Нове замовлення
          </MuiButton>
        ) : (
          <MuiButton
            href="/orders/new"
            variant="contained"
            size="large"
            startIcon={<Plus size={18} />}
          >
            Нове замовлення
          </MuiButton>
        )
      }
    >
      <OrdersTable rows={rows} />
    </ModulePage>
  );
}
