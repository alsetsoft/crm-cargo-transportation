"use server";

import { revalidatePath } from "next/cache";

import { logAudit } from "@/lib/audit";
import { createClient } from "@/lib/supabase/server";
import { orderInputSchema, type OrderInput } from "@/lib/validation/order";

type ActionResult = { ok: true } | { ok: false; error: string };

function buildPayload(input: OrderInput) {
  return {
    number: input.number,
    client_id: input.client_id,
    loading_place: input.loading_place ?? null,
    unloading_place: input.unloading_place ?? null,
    driver_id: input.driver_id ?? null,
    vehicle_id: input.vehicle_id ?? null,
    departed_at: input.departed_at ?? null,
    arrived_at: input.arrived_at ?? null,
    distance_km: input.distance_km,
    volume_tons: input.volume_tons ?? null,
    price_uah: input.price_uah,
    price_per_km_override_uah: input.price_per_km_override_uah ?? null,
    driver_commission_override_uah:
      input.driver_commission_override_uah ?? null,
    payment_form: input.payment_form,
    payment_status: input.payment_status,
    refuels_count: input.refuels_count,
    odometer_start: input.odometer_start ?? null,
    odometer_end: input.odometer_end ?? null,
    fuel_cost_uah: input.fuel_cost_uah,
    status: input.status,
    notes: input.notes ?? null,
  };
}

async function replaceExpenses(
  supabase: Awaited<ReturnType<typeof createClient>>,
  orderId: string,
  expenses: OrderInput["expenses"],
): Promise<{ error: string | null }> {
  const del = await supabase
    .from("expenses")
    .delete()
    .eq("order_id", orderId);
  if (del.error) return { error: del.error.message };

  if (expenses.length === 0) return { error: null };

  const rows = expenses.map((e) => ({
    order_id: orderId,
    name: e.name,
    amount_uah: e.amount_uah,
  }));
  const ins = await supabase.from("expenses").insert(rows);
  if (ins.error) return { error: ins.error.message };
  return { error: null };
}

export async function createOrderAction(input: OrderInput): Promise<ActionResult> {
  const parsed = orderInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert(buildPayload(parsed.data))
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  const exp = await replaceExpenses(supabase, data.id, parsed.data.expenses);
  if (exp.error) return { ok: false, error: exp.error };

  await logAudit({
    entity_type: "order",
    entity_id: data.id,
    entity_label: `№${parsed.data.number}`,
    action: "created",
  });

  revalidatePath("/orders");
  revalidatePath("/clients");
  revalidatePath("/drivers");
  revalidatePath("/vehicles");
  revalidatePath("/expenses");
  revalidatePath("/");
  return { ok: true };
}

export async function updateOrderAction(
  id: string,
  input: OrderInput,
): Promise<ActionResult> {
  const parsed = orderInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update(buildPayload(parsed.data))
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  const exp = await replaceExpenses(supabase, id, parsed.data.expenses);
  if (exp.error) return { ok: false, error: exp.error };

  await logAudit({
    entity_type: "order",
    entity_id: id,
    entity_label: `№${parsed.data.number}`,
    action: "updated",
  });

  revalidatePath("/orders");
  revalidatePath("/clients");
  revalidatePath("/drivers");
  revalidatePath("/vehicles");
  revalidatePath("/expenses");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteOrderAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("number")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "order",
    entity_id: id,
    entity_label: existing?.number ? `№${existing.number}` : null,
    action: "deleted",
  });

  revalidatePath("/orders");
  revalidatePath("/clients");
  revalidatePath("/expenses");
  revalidatePath("/");
  return { ok: true };
}
