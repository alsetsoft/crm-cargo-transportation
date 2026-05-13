import { ModulePage } from "@/components/crm/module-page";
import { listExpenses } from "@/lib/data/expenses";
import { listOrders } from "@/lib/data/orders";

import { ExpenseFormDialog } from "./_components/expense-form-dialog";
import { ExpensesTable } from "./_components/expenses-table";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const [rows, orders] = await Promise.all([
    listExpenses(),
    listOrders({ limit: 200 }),
  ]);

  const orderOptions = orders.map((o) => ({
    id: o.id!,
    number: o.number ?? "",
    client_name: o.client_name ?? "",
  }));

  return (
    <ModulePage
      eyebrow="Облік · Витрати"
      title="Витрати"
      description="Загальний реєстр витрат — як прив'язаних до замовлень, так і власних."
      actions={<ExpenseFormDialog mode="create" orderOptions={orderOptions} />}
    >
      <ExpensesTable rows={rows} orderOptions={orderOptions} />
    </ModulePage>
  );
}
