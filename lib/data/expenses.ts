import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export type ExpenseRow = Tables<"expenses">;

export type ExpenseWithOrder = ExpenseRow & {
  order_number: string | null;
  client_name: string | null;
};

export async function listExpenses(limit = 200): Promise<ExpenseWithOrder[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses")
    .select(
      "id, name, amount_uah, spent_at, order_id, notes, created_at, orders:order_id (number, clients:client_id (name))",
    )
    .order("spent_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  type Joined = ExpenseRow & {
    orders: {
      number: string | null;
      clients: { name: string | null } | null;
    } | null;
  };
  return ((data ?? []) as unknown as Joined[]).map((r) => ({
    id: r.id,
    name: r.name,
    amount_uah: r.amount_uah,
    spent_at: r.spent_at,
    order_id: r.order_id,
    notes: r.notes,
    created_at: r.created_at,
    order_number: r.orders?.number ?? null,
    client_name: r.orders?.clients?.name ?? null,
  }));
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
