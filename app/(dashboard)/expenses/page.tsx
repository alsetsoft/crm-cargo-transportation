import MuiButton from "@mui/material/Button";
import { Plus } from "lucide-react";

import { ModulePage } from "@/components/crm/module-page";
import { listExpenses } from "@/lib/data/expenses";

import { ExpensesTable } from "./_components/expenses-table";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const rows = await listExpenses();

  return (
    <ModulePage
      eyebrow="Облік · Витрати"
      title="Витрати"
      description="Загальний реєстр витрат — як прив'язаних до замовлень, так і власних."
      actions={
        <MuiButton
          href="/expenses/new"
          variant="contained"
          size="large"
          startIcon={<Plus size={18} />}
        >
          Нова витрата
        </MuiButton>
      }
    >
      <ExpensesTable rows={rows} />
    </ModulePage>
  );
}
