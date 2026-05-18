"use server";

import { revalidatePath } from "next/cache";

import { logAudit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { VEHICLE_DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import { getVehicleCurrentOdometer } from "@/lib/data/service-procedures";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/types";
import {
  serviceProcedureInputSchema,
  type ServiceProcedureInput,
} from "@/lib/validation/service-procedure";

type ActionResult = { ok: true } | { ok: false; error: string };

function revalidate(vehicleId: string) {
  revalidatePath(`/vehicles/${vehicleId}/service-book`);
  revalidatePath("/vehicles");
}

function procedureLabel(
  type: Enums<"vehicle_document_type">,
  vehicleLabel?: string | null,
): string {
  const typeLabel = VEHICLE_DOCUMENT_TYPE_LABELS[type];
  return vehicleLabel ? `${typeLabel} · ${vehicleLabel}` : typeLabel;
}

async function fetchVehicleLabel(
  supabase: Awaited<ReturnType<typeof createClient>>,
  vehicleId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("vehicles")
    .select("plate, unit")
    .eq("id", vehicleId)
    .maybeSingle();
  if (!data) return null;
  return `${data.plate} · ${data.unit}`;
}

export async function createServiceProcedureAction(
  vehicleId: string,
  input: ServiceProcedureInput,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = serviceProcedureInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Невірні дані" };
  }
  const supabase = await createClient();
  const isInsurance = parsed.data.type === "insurance";
  const { data, error } = await supabase
    .from("vehicle_service_procedures")
    .insert({
      vehicle_id: vehicleId,
      type: parsed.data.type,
      period_km: isInsurance ? null : (parsed.data.period_km ?? null),
      period_days: isInsurance ? null : (parsed.data.period_days ?? null),
      insurance_start_date: isInsurance
        ? (parsed.data.insurance_start_date ?? null)
        : null,
      insurance_end_date: isInsurance
        ? (parsed.data.insurance_end_date ?? null)
        : null,
      notes: parsed.data.notes ?? null,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  const vehicleLabel = await fetchVehicleLabel(supabase, vehicleId);
  await logAudit({
    entity_type: "service_procedure",
    entity_id: data?.id ?? null,
    entity_label: procedureLabel(parsed.data.type, vehicleLabel),
    action: "created",
  });

  revalidate(vehicleId);
  return { ok: true };
}

export async function deleteServiceProcedureAction(
  id: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { data: proc, error: fetchError } = await supabase
    .from("vehicle_service_procedures")
    .select("vehicle_id, type")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) return { ok: false, error: fetchError.message };

  const { error } = await supabase
    .from("vehicle_service_procedures")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  if (proc?.vehicle_id) {
    const vehicleLabel = await fetchVehicleLabel(supabase, proc.vehicle_id);
    await logAudit({
      entity_type: "service_procedure",
      entity_id: id,
      entity_label: procedureLabel(proc.type, vehicleLabel),
      action: "deleted",
    });
    revalidate(proc.vehicle_id);
  }
  return { ok: true };
}

export async function markServiceProcedureDoneAction(
  procedureId: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { data: proc, error: fetchError } = await supabase
    .from("vehicle_service_procedures")
    .select("vehicle_id, type")
    .eq("id", procedureId)
    .maybeSingle();
  if (fetchError) return { ok: false, error: fetchError.message };
  if (!proc) return { ok: false, error: "Процедуру не знайдено" };

  const odometer = await getVehicleCurrentOdometer(proc.vehicle_id);

  const { error } = await supabase.from("vehicle_service_records").insert({
    procedure_id: procedureId,
    odometer: odometer > 0 ? odometer : null,
  });
  if (error) return { ok: false, error: error.message };

  const vehicleLabel = await fetchVehicleLabel(supabase, proc.vehicle_id);
  await logAudit({
    entity_type: "service_procedure",
    entity_id: procedureId,
    entity_label: procedureLabel(proc.type, vehicleLabel),
    action: "completed",
    description: odometer > 0 ? `Пробіг: ${odometer} км` : null,
  });

  revalidate(proc.vehicle_id);
  return { ok: true };
}

export async function undoServiceProcedureAction(
  procedureId: string,
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: proc, error: fetchError } = await supabase
    .from("vehicle_service_procedures")
    .select("vehicle_id, type")
    .eq("id", procedureId)
    .maybeSingle();
  if (fetchError) return { ok: false, error: fetchError.message };
  if (!proc) return { ok: false, error: "Процедуру не знайдено" };

  const { data: lastRecord, error: recError } = await supabase
    .from("vehicle_service_records")
    .select("id")
    .eq("procedure_id", procedureId)
    .order("completed_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (recError) return { ok: false, error: recError.message };
  if (!lastRecord) {
    return { ok: false, error: "Немає виконань для скасування" };
  }

  const { error } = await supabase
    .from("vehicle_service_records")
    .delete()
    .eq("id", lastRecord.id);
  if (error) return { ok: false, error: error.message };

  const vehicleLabel = await fetchVehicleLabel(supabase, proc.vehicle_id);
  await logAudit({
    entity_type: "service_procedure",
    entity_id: procedureId,
    entity_label: procedureLabel(proc.type, vehicleLabel),
    action: "reverted",
  });

  revalidate(proc.vehicle_id);
  return { ok: true };
}
