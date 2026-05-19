"use server";

import { revalidatePath } from "next/cache";

import { logAudit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { vehicleInputSchema, type VehicleInput } from "@/lib/validation/vehicle";

type ActionResult = { ok: true } | { ok: false; error: string };

function buildPayload(input: VehicleInput) {
  return {
    unit: input.unit,
    plate: input.plate,
    current_driver_id: input.current_driver_id ?? null,
    dozor_device_uid: input.dozor_device_uid ?? null,
    fuel_norm_l_100km: input.fuel_norm_l_100km ?? null,
    status: input.status,
    service_next_date: input.service_next_date ?? null,
    service_next_odometer: input.service_next_odometer ?? null,
    notes: input.notes ?? null,
  };
}

function vehicleLabel(plate: string, unit: string): string {
  return `${plate} · ${unit}`;
}

export async function createVehicleAction(input: VehicleInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = vehicleInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .insert(buildPayload(parsed.data))
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "vehicle",
    entity_id: data?.id ?? null,
    entity_label: vehicleLabel(parsed.data.plate, parsed.data.unit),
    action: "created",
  });

  revalidatePath("/vehicles");
  revalidatePath("/drivers");
  revalidatePath("/orders");
  revalidatePath("/gps");
  revalidatePath("/");
  return { ok: true };
}

export async function updateVehicleAction(
  id: string,
  input: VehicleInput,
): Promise<ActionResult> {
  await requireAdmin();
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

  await logAudit({
    entity_type: "vehicle",
    entity_id: id,
    entity_label: vehicleLabel(parsed.data.plate, parsed.data.unit),
    action: "updated",
  });

  revalidatePath("/vehicles");
  revalidatePath("/drivers");
  revalidatePath("/orders");
  revalidatePath("/gps");
  return { ok: true };
}

export async function deleteVehicleAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("vehicles")
    .select("plate, unit")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "vehicle",
    entity_id: id,
    entity_label: existing ? vehicleLabel(existing.plate, existing.unit) : null,
    action: "deleted",
  });

  revalidatePath("/vehicles");
  revalidatePath("/drivers");
  revalidatePath("/gps");
  return { ok: true };
}
