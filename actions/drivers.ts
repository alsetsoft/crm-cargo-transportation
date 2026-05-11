"use server";

import { revalidatePath } from "next/cache";

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
    notes: input.notes ?? null,
  };
}

export async function createDriverAction(input: DriverInput): Promise<ActionResult> {
  const parsed = driverInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("drivers").insert(buildPayload(parsed.data));
  if (error) return { ok: false, error: error.message };
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
  revalidatePath("/drivers");
  revalidatePath("/vehicles");
  revalidatePath("/orders");
  return { ok: true };
}

export async function deleteDriverAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("drivers").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/drivers");
  revalidatePath("/vehicles");
  return { ok: true };
}
