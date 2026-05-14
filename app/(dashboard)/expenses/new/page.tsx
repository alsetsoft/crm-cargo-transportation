import { PageHeader } from "@/components/crm/page-header";
import { listOrders } from "@/lib/data/orders";

import { ExpenseFormPage } from "../_components/expense-form-page";

export const dynamic = "force-dynamic";

export default async function NewExpensePage() {
  const orders = await listOrders({ limit: 200 });
  const orderOptions = orders.map((o) => ({
    id: o.id!,
    number: o.number ?? "",
    client_name: o.client_name ?? "",
  }));

  return (
    <>
      <PageHeader title="Нова витрата" backHref="/expenses" backLabel="До реєстру" />
      <ExpenseFormPage mode="create" orderOptions={orderOptions} />
    </>
  );
}
