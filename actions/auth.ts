"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { signInSchema, type SignInInput } from "@/lib/validation/auth";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function signInAction(
  input: SignInInput,
  redirectTo?: string,
): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.session) {
    return { ok: false, error: "Невірний email або пароль" };
  }

  // Verify the signed-in user actually has admin access. Stops users who
  // exist in auth.users but were never granted a profile row.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    return { ok: false, error: "Доступ заборонено" };
  }

  revalidatePath("/", "layout");
  redirect(safeRedirect(redirectTo) ?? "/");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// Only accept same-origin relative paths so an attacker cannot forge a
// link that redirects to an external domain after login.
function safeRedirect(target: string | undefined): string | null {
  if (!target) return null;
  if (!target.startsWith("/") || target.startsWith("//")) return null;
  return target;
}
