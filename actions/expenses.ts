"use server";

import { revalidatePath } from "next/cache";

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
  const { error } = await supabase
    .from("expenses")
    .insert(buildPayload(parsed.data));
  if (error) return { ok: false, error: error.message };

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

  revalidatePath("/expenses");
  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteExpenseAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/expenses");
  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true };
}
