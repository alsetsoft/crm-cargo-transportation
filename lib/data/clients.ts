import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export type ClientRow = Tables<"clients">;
export type ClientWithStats = Tables<"clients_with_stats">;

export async function listClients(): Promise<ClientWithStats[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients_with_stats")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export type ClientSelectOption = Pick<
  ClientRow,
  "id" | "name" | "code" | "contact_person"
>;

export async function listActiveClients(): Promise<ClientSelectOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, code, contact_person");
  if (error) throw error;
  // Sort on the JS side with Ukrainian collation — Postgres' default
  // collation puts Cyrillic letters in an order that doesn't match the
  // Ukrainian alphabet (the bug report: "CL-006 first, then CL-004 …").
  // `localeCompare` with the "uk" locale gives the user-expected А–Я order.
  return (data ?? []).slice().sort((a, b) =>
    a.name.localeCompare(b.name, "uk", { sensitivity: "base" }),
  );
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

export async function suggestNextClientCode(): Promise<string> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("clients")
    .select("id", { count: "exact", head: true });
  const next = (count ?? 0) + 1;
  return `CL-${String(next).padStart(3, "0")}`;
}
