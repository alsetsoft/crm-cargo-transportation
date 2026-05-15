import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export type SessionUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
};

/**
 * Resolve the current user from the Supabase session and join to the
 * profile row to read their role. Returns null when there is no session
 * or no matching profile. Cached per-request via React `cache` so the
 * layout and the DAL share one auth round-trip.
 *
 * Uses `auth.getUser()` rather than `getSession()` so the JWT is
 * re-validated against the auth server — cookies alone are spoofable.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id, email, full_name, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: profile.user_id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role,
  };
});

/**
 * Hard auth gate for Server Components and Server Actions. Redirects to
 * /login on missing session, throws on role mismatch. Use at the entry
 * point of every request that touches business data.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "admin") {
    // Future roles will branch here. For now there is only one.
    throw new Error("Forbidden: admin role required");
  }
  return user;
}
