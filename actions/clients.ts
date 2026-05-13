"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { clientInputSchema, type ClientInput } from "@/lib/validation/client";

type ActionResult = { ok: true } | { ok: false; error: string };

function buildPayload(input: ClientInput) {
  return {
    code: input.code,
    name: input.name,
    contact_person: input.contact_person ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    status: input.status,
    notes: input.notes ?? null,
  };
}

export async function createClientAction(input: ClientInput): Promise<ActionResult> {
  const parsed = clientInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("clients").insert(buildPayload(parsed.data));
  if (error) return { ok: false, error: error.message };
  revalidatePath("/clients");
  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true };
}

export async function updateClientAction(
  id: string,
  input: ClientInput,
): Promise<ActionResult> {
  const parsed = clientInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update(buildPayload(parsed.data))
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/clients");
  revalidatePath("/orders");
  return { ok: true };
}

export async function deleteClientAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/clients");
  return { ok: true };
}
