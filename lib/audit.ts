import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AuditEntityType =
  | "client"
  | "driver"
  | "vehicle"
  | "order"
  | "expense"
  | "service_procedure"
  | "service_record";

export type AuditAction =
  | "created"
  | "updated"
  | "deleted"
  | "completed"
  | "reverted";

type LogAuditArgs = {
  entity_type: AuditEntityType;
  entity_id?: string | null;
  entity_label?: string | null;
  action: AuditAction;
  description?: string | null;
};

/**
 * Best-effort audit log insert. Errors are swallowed so that auditing never
 * blocks the underlying mutation — the user already saw the action succeed.
 */
export async function logAudit(args: LogAuditArgs): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from("audit_logs").insert({
      entity_type: args.entity_type,
      entity_id: args.entity_id ?? null,
      entity_label: args.entity_label ?? null,
      action: args.action,
      description: args.description ?? null,
    });
  } catch {
    // ignore — auditing is best-effort
  }
}
