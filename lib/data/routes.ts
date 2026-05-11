import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export type RouteRow = Tables<"routes">;

export async function listRoutes(): Promise<RouteRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getRoute(id: string): Promise<RouteRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listActiveRoutes(): Promise<
  Pick<RouteRow, "id" | "name">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routes")
    .select("id, name")
    .eq("status", "active")
    .order("name");
  if (error) throw error;
  return data ?? [];
}
