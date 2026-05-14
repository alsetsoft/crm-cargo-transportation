import { notFound } from "next/navigation";

import { PageHeader } from "@/components/crm/page-header";
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
      <PageHeader
        title={`Зміна замовлення №${orderData.order.number}`}
        backHref="/orders"
        backLabel="До журналу"
      />

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
