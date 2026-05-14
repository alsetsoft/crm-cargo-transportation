import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export type ExpenseRow = Tables<"expenses">;

/**
 * Where a row in the expenses register comes from:
 * - `manual` — a real row in the `expenses` table (editable/deletable);
 * - `fuel` / `commission` — virtual rows derived from an order's
 *   `fuel_cost_uah` / `driver_commission_uah` (read-only, edited via the order).
 */
export type ExpenseSource = "manual" | "fuel" | "commission";

export type ExpenseListRow = {
  id: string;
  name: string;
  amount_uah: number;
  spent_at: string | null;
  notes: string | null;
  order_id: string | null;
  order_number: string | null;
  client_name: string | null;
  source: ExpenseSource;
};

function expenseDate(value: string | null | undefined): string | null {
  if (!value) return null;
  // `spent_at` is a DATE column — virtual rows derive from timestamptz fields.
  return value.slice(0, 10);
}

export async function listExpenses(limit = 200): Promise<ExpenseListRow[]> {
  const supabase = await createClient();

  const [expensesRes, ordersRes] = await Promise.all([
    supabase
      .from("expenses")
      .select(
        "id, name, amount_uah, spent_at, order_id, notes, created_at, orders:order_id (number, clients:client_id (name))",
      )
      .order("spent_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("orders_with_metrics")
      .select(
        "id, number, client_name, fuel_cost_uah, driver_commission_uah, departed_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);
  if (expensesRes.error) throw expensesRes.error;
  if (ordersRes.error) throw ordersRes.error;

  type JoinedExpense = ExpenseRow & {
    orders: {
      number: string | null;
      clients: { name: string | null } | null;
    } | null;
  };

  const manual: ExpenseListRow[] = (
    (expensesRes.data ?? []) as unknown as JoinedExpense[]
  ).map((r) => ({
    id: r.id,
    name: r.name,
    amount_uah: Number(r.amount_uah ?? 0),
    spent_at: r.spent_at,
    notes: r.notes,
    order_id: r.order_id,
    order_number: r.orders?.number ?? null,
    client_name: r.orders?.clients?.name ?? null,
    source: "manual",
  }));

  const derived: ExpenseListRow[] = [];
  for (const o of ordersRes.data ?? []) {
    if (!o.id) continue;
    const date = expenseDate(o.departed_at ?? o.created_at);
    const fuel = Number(o.fuel_cost_uah ?? 0);
    const commission = Number(o.driver_commission_uah ?? 0);
    if (fuel > 0) {
      derived.push({
        id: `fuel:${o.id}`,
        name: "Пальне (із замовлення)",
        amount_uah: fuel,
        spent_at: date,
        notes: null,
        order_id: o.id,
        order_number: o.number,
        client_name: o.client_name,
        source: "fuel",
      });
    }
    if (commission > 0) {
      derived.push({
        id: `commission:${o.id}`,
        name: "Комісія водія (із замовлення)",
        amount_uah: commission,
        spent_at: date,
        notes: null,
        order_id: o.id,
        order_number: o.number,
        client_name: o.client_name,
        source: "commission",
      });
    }
  }

  return [...manual, ...derived]
    .sort((a, b) => (b.spent_at ?? "").localeCompare(a.spent_at ?? ""))
    .slice(0, limit);
}

export async function getExpense(id: string): Promise<ExpenseRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getExpensesTotalThisMonth(): Promise<number> {
  const supabase = await createClient();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from("expenses")
    .select("amount_uah")
    .gte("spent_at", monthStart.toISOString().slice(0, 10));
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => sum + Number(row.amount_uah ?? 0), 0);
}
