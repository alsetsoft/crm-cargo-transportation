import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export type AuditLogRow = Tables<"audit_logs">;

export async function listAuditLogs(limit = 200): Promise<AuditLogRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
