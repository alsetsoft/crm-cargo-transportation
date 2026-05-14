"use server";

import { revalidatePath } from "next/cache";

import { logAudit } from "@/lib/audit";
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

function clientLabel(code: string, name: string): string {
  return `${name} (${code})`;
}

export async function createClientAction(input: ClientInput): Promise<ActionResult> {
  const parsed = clientInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert(buildPayload(parsed.data))
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "client",
    entity_id: data?.id ?? null,
    entity_label: clientLabel(parsed.data.code, parsed.data.name),
    action: "created",
  });

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

  await logAudit({
    entity_type: "client",
    entity_id: id,
    entity_label: clientLabel(parsed.data.code, parsed.data.name),
    action: "updated",
  });

  revalidatePath("/clients");
  revalidatePath("/orders");
  return { ok: true };
}

export async function deleteClientAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("clients")
    .select("code, name")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  await logAudit({
    entity_type: "client",
    entity_id: id,
    entity_label: existing ? clientLabel(existing.code, existing.name) : null,
    action: "deleted",
  });

  revalidatePath("/clients");
  return { ok: true };
}
