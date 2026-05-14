import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Облік · Витрати</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Редагувати витрату
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {expense.name}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
          <Button variant="outline" asChild>
            <Link href="/expenses">
              <ArrowLeft className="size-4" />
              До реєстру
            </Link>
          </Button>
        </div>
      </section>

      <ExpenseFormPage
        mode="edit"
        expense={expense}
        orderOptions={orderOptions}
      />
    </>
  );
}
