import { notFound } from "next/navigation";

import Stack from "@mui/material/Stack";

import { PageHeader } from "@/components/crm/page-header";
import { getExpense } from "@/lib/data/expenses";
import { listOrders } from "@/lib/data/orders";

import { ExpenseFormPage } from "../../_components/expense-form-page";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditExpensePage({ params }: PageProps) {
  const { id } = await params;
  const [expense, orders] = await Promise.all([
    getExpense(id),
    listOrders({ limit: 200 }),
  ]);

  if (!expense) {
    notFound();
  }

  const orderOptions = orders.map((o) => ({
    id: o.id!,
    number: o.number ?? "",
    client_name: o.client_name ?? "",
  }));

  return (
    <Stack spacing={3}>
      <PageHeader
        title={`Зміна витрати · ${expense.name}`}
        backHref="/expenses"
        backLabel="До реєстру"
      />
      <ExpenseFormPage
        mode="edit"
        expense={expense}
        orderOptions={orderOptions}
      />
    </Stack>
  );
}
