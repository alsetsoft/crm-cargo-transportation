import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables, Views } from "@/lib/supabase/types";

export type DriverRow = Tables<"drivers">;
export type DriverWithStats = Views<"drivers_with_stats">;

export async function listDrivers(): Promise<DriverWithStats[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("drivers_with_stats")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export type DriverSelectOption = {
  id: string;
  full_name: string;
  commission_per_km_uah: number;
};

export async function listDriversForSelect(): Promise<DriverSelectOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("drivers")
    .select("id, full_name, commission_per_km_uah")
    .order("full_name");
  if (error) throw error;
  return data ?? [];
}

export async function getDriver(id: string): Promise<DriverRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
