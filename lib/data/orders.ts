import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Enums, Tables, Views } from "@/lib/supabase/types";

export type OrderRow = Tables<"orders">;
export type OrderWithMetrics = Views<"orders_with_metrics">;
export type OrderStatus = Enums<"order_status">;

export async function listOrders(opts?: {
  status?: OrderStatus;
  limit?: number;
}): Promise<OrderWithMetrics[]> {
  const supabase = await createClient();
  let q = supabase
    .from("orders_with_metrics")
    .select("*")
    .order("created_at", { ascending: false });
  if (opts?.status) q = q.eq("status", opts.status);
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getOrder(id: string): Promise<OrderRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getOrdersCountByStatus(): Promise<
  Record<OrderStatus, number>
> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select("status");
  if (error) throw error;
  const counts: Record<OrderStatus, number> = {
    new: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const row of data ?? []) {
    counts[row.status as OrderStatus] += 1;
  }
  return counts;
}

export async function getMonthlyRevenue(): Promise<number> {
  const supabase = await createClient();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from("orders")
    .select("price_uah")
    .gte("created_at", monthStart.toISOString());
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => sum + Number(row.price_uah ?? 0), 0);
}

export async function suggestNextOrderNumber(): Promise<string> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });
  return String((count ?? 0) + 1001);
}
