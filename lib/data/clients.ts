import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables, Views } from "@/lib/supabase/types";

export type ClientRow = Tables<"clients">;
export type ClientWithStats = Views<"clients_with_stats">;

export async function listClients(): Promise<ClientWithStats[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients_with_stats")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listActiveClients(): Promise<
  Pick<ClientRow, "id" | "name" | "code">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, code")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getClient(id: string): Promise<ClientRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getDebtorClients(limit = 5): Promise<ClientWithStats[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients_with_stats")
    .select("*")
    .gt("debt_uah", 0)
    .order("debt_uah", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function suggestNextClientCode(): Promise<string> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true });
  const next = (count ?? 0) + 1;
  return `CL-${String(next).padStart(3, "0")}`;
}
