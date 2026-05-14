import { Plus } from "lucide-react";
import Link from "next/link";

import { ModulePage } from "@/components/crm/module-page";
import { Button } from "@/components/ui/button";
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
        <Button asChild>
          <Link href="/expenses/new">
            <Plus className="size-4" />
            Нова витрата
          </Link>
        </Button>
      }
    >
      <ExpensesTable rows={rows} />
    </ModulePage>
  );
}
