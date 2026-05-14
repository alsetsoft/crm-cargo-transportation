"use server";

import { revalidatePath } from "next/cache";

import { logAudit } from "@/lib/audit";
import { createClient } from "@/lib/supabase/server";
import { expenseInputSchema, type ExpenseInput } from "@/lib/validation/expense";

type ActionResult = { ok: true } | { ok: false; error: string };

function buildPayload(input: ExpenseInput) {
  return {
    name: input.name,
    amount_uah: input.amount_uah,
    spent_at: input.spent_at,
    order_id: input.order_id ?? null,
    notes: input.notes ?? null,
  };
}

export async function createExpenseAction(
  input: ExpenseInput,
): Promise<ActionResult> {
  const parsed = expenseInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses")
    .insert(buildPayload(parsed.data))
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "expense",
    entity_id: data?.id ?? null,
    entity_label: parsed.data.name,
    action: "created",
  });

  revalidatePath("/expenses");
  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true };
}

export async function updateExpenseAction(
  id: string,
  input: ExpenseInput,
): Promise<ActionResult> {
  const parsed = expenseInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("expenses")
    .update(buildPayload(parsed.data))
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "expense",
    entity_id: id,
    entity_label: parsed.data.name,
    action: "updated",
  });

  revalidatePath("/expenses");
  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteExpenseAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("expenses")
    .select("name")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "expense",
    entity_id: id,
    entity_label: existing?.name ?? null,
    action: "deleted",
  });

  revalidatePath("/expenses");
  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true };
}
