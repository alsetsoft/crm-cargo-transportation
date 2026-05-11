"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { routeInputSchema, type RouteInput } from "@/lib/validation/route";

type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

function buildPayload(input: RouteInput) {
  return {
    name: input.name,
    point_a: input.point_a,
    point_b: input.point_b,
    distance_km: input.distance_km,
    typical_duration_hours: input.typical_duration_hours ?? null,
    status: input.status,
    notes: input.notes ?? null,
  };
}

export async function createRouteAction(
  input: RouteInput,
): Promise<ActionResult> {
  const parsed = routeInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("routes").insert(buildPayload(parsed.data));
  if (error) return { ok: false, error: error.message };
  revalidatePath("/routes");
  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true };
}

export async function updateRouteAction(
  id: string,
  input: RouteInput,
): Promise<ActionResult> {
  const parsed = routeInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("routes")
    .update(buildPayload(parsed.data))
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/routes");
  revalidatePath("/orders");
  return { ok: true };
}

export async function deleteRouteAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("routes").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/routes");
  revalidatePath("/orders");
  return { ok: true };
}
