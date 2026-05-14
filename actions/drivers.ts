"use server";

import { revalidatePath } from "next/cache";

import { logAudit } from "@/lib/audit";
import { createClient } from "@/lib/supabase/server";
import { driverInputSchema, type DriverInput } from "@/lib/validation/driver";

type ActionResult = { ok: true } | { ok: false; error: string };

function buildPayload(input: DriverInput) {
  return {
    full_name: input.full_name,
    phone: input.phone ?? null,
    current_vehicle_id: input.current_vehicle_id ?? null,
    status: input.status,
    rating: input.rating ?? null,
    commission_per_km_uah: input.commission_per_km_uah,
    notes: input.notes ?? null,
  };
}

export async function createDriverAction(input: DriverInput): Promise<ActionResult> {
  const parsed = driverInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("drivers")
    .insert(buildPayload(parsed.data))
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "driver",
    entity_id: data?.id ?? null,
    entity_label: parsed.data.full_name,
    action: "created",
  });

  revalidatePath("/drivers");
  revalidatePath("/vehicles");
  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true };
}

export async function updateDriverAction(
  id: string,
  input: DriverInput,
): Promise<ActionResult> {
  const parsed = driverInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("drivers")
    .update(buildPayload(parsed.data))
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "driver",
    entity_id: id,
    entity_label: parsed.data.full_name,
    action: "updated",
  });

  revalidatePath("/drivers");
  revalidatePath("/vehicles");
  revalidatePath("/orders");
  return { ok: true };
}

export async function deleteDriverAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("drivers")
    .select("full_name")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("drivers").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "driver",
    entity_id: id,
    entity_label: existing?.full_name ?? null,
    action: "deleted",
  });

  revalidatePath("/drivers");
  revalidatePath("/vehicles");
  return { ok: true };
}
