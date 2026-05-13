import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables, Views } from "@/lib/supabase/types";

export type VehicleRow = Tables<"vehicles">;
export type VehicleWithStats = Views<"vehicles_with_stats">;
export type VehicleDocumentRow = Tables<"vehicle_documents">;

export async function listVehicles(): Promise<VehicleWithStats[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles_with_stats")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listVehicleDocumentsByVehicleId(): Promise<
  Record<string, VehicleDocumentRow[]>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_documents")
    .select("*")
    .order("valid_until");
  if (error) throw error;
  const grouped: Record<string, VehicleDocumentRow[]> = {};
  for (const doc of data ?? []) {
    if (!grouped[doc.vehicle_id]) grouped[doc.vehicle_id] = [];
    grouped[doc.vehicle_id].push(doc);
  }
  return grouped;
}

export async function listAvailableVehicles(): Promise<
  Pick<VehicleRow, "id" | "unit" | "plate">[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("id, unit, plate")
    .order("plate");
  if (error) throw error;
  return data ?? [];
}

export async function getVehicle(id: string): Promise<VehicleRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
