"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { orderInputSchema, type OrderInput } from "@/lib/validation/order";

type ActionResult = { ok: true } | { ok: false; error: string };

function buildPayload(input: OrderInput) {
  return {
    number: input.number,
    client_id: input.client_id,
    route_id: input.route_id ?? null,
    driver_id: input.driver_id ?? null,
    vehicle_id: input.vehicle_id ?? null,
    volume_tons: input.volume_tons ?? null,
    price_uah: input.price_uah,
    km_salary: input.km_salary ?? null,
    km_invoice: input.km_invoice ?? null,
    payment_form: input.payment_form,
    payment_status: input.payment_status,
    refuels_count: input.refuels_count,
    odometer_start: input.odometer_start ?? null,
    odometer_end: input.odometer_end ?? null,
    fuel_cost_uah: input.fuel_cost_uah,
    actual_profit_uah: input.actual_profit_uah ?? null,
    status: input.status,
    notes: input.notes ?? null,
  };
}

export async function createOrderAction(input: OrderInput): Promise<ActionResult> {
  const parsed = orderInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("orders").insert(buildPayload(parsed.data));
  if (error) return { ok: false, error: error.message };
  revalidatePath("/orders");
  revalidatePath("/clients");
  revalidatePath("/drivers");
  revalidatePath("/vehicles");
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
  revalidatePath("/orders");
  revalidatePath("/clients");
  revalidatePath("/drivers");
  revalidatePath("/vehicles");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteOrderAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/orders");
  revalidatePath("/clients");
  revalidatePath("/");
  return { ok: true };
}
