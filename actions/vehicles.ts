"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { vehicleInputSchema, type VehicleInput } from "@/lib/validation/vehicle";

type ActionResult = { ok: true } | { ok: false; error: string };

function buildPayload(input: VehicleInput) {
  return {
    unit: input.unit,
    plate: input.plate,
    current_driver_id: input.current_driver_id ?? null,
    fuel_norm_l_100km: input.fuel_norm_l_100km ?? null,
    status: input.status,
    service_next_date: input.service_next_date ?? null,
    service_next_odometer: input.service_next_odometer ?? null,
    notes: input.notes ?? null,
  };
}

export async function createVehicleAction(input: VehicleInput): Promise<ActionResult> {
  const parsed = vehicleInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").insert(buildPayload(parsed.data));
  if (error) return { ok: false, error: error.message };
  revalidatePath("/vehicles");
  revalidatePath("/drivers");
  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true };
}

export async function updateVehicleAction(
  id: string,
  input: VehicleInput,
): Promise<ActionResult> {
  const parsed = vehicleInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("vehicles")
    .update(buildPayload(parsed.data))
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/vehicles");
  revalidatePath("/drivers");
  revalidatePath("/orders");
  return { ok: true };
}

export async function deleteVehicleAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/vehicles");
  revalidatePath("/drivers");
  return { ok: true };
}
