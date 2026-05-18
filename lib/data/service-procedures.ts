import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/types";

export type ServiceProcedureRow = Tables<"vehicle_service_procedures">;
export type ServiceRecordRow = Tables<"vehicle_service_records">;

export type ServiceProcedureStatus = "ok" | "due_soon" | "overdue" | "unknown";

export type ServiceProcedureView = ServiceProcedureRow & {
  last_completed_at: string | null;
  last_odometer: number | null;
  records_count: number;
  remaining_km: number | null;
  remaining_days: number | null;
  status: ServiceProcedureStatus;
};

/**
 * Best-known current odometer for a vehicle — taken from the largest
 * `odometer_end` recorded across its orders. Falls back to the vehicle's
 * `service_next_odometer` (a manually configured baseline), then 0.
 */
export async function getVehicleCurrentOdometer(
  vehicleId: string,
): Promise<number> {
  const supabase = await createClient();

  const [ordersRes, vehicleRes] = await Promise.all([
    supabase
      .from("orders")
      .select("odometer_end")
      .eq("vehicle_id", vehicleId)
      .not("odometer_end", "is", null)
      .order("odometer_end", { ascending: false })
      .limit(1),
    supabase
      .from("vehicles")
      .select("service_next_odometer")
      .eq("id", vehicleId)
      .maybeSingle(),
  ]);
  if (ordersRes.error) throw ordersRes.error;
  if (vehicleRes.error) throw vehicleRes.error;

  const fromOrder = Number(ordersRes.data?.[0]?.odometer_end ?? 0) || 0;
  const fromVehicle = Number(vehicleRes.data?.service_next_odometer ?? 0) || 0;
  return Math.max(fromOrder, fromVehicle, 0);
}

function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(fromIso + "T00:00:00Z").getTime();
  const to = new Date(toIso + "T00:00:00Z").getTime();
  return Math.round((to - from) / 86_400_000);
}

function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function classify(
  remainingKm: number | null,
  remainingDays: number | null,
  periodKm: number | null,
  periodDays: number | null,
  hasRecord: boolean,
): ServiceProcedureStatus {
  if (!hasRecord) return "unknown";
  const overdueKm = remainingKm != null && remainingKm <= 0;
  const overdueDays = remainingDays != null && remainingDays <= 0;
  if (overdueKm || overdueDays) return "overdue";

  const dueSoonKm =
    remainingKm != null && periodKm != null && remainingKm <= periodKm * 0.15;
  const dueSoonDays =
    remainingDays != null &&
    periodDays != null &&
    remainingDays <= Math.max(periodDays * 0.15, 7);
  if (dueSoonKm || dueSoonDays) return "due_soon";

  return "ok";
}

export async function listServiceProceduresForVehicle(
  vehicleId: string,
): Promise<{
  rows: ServiceProcedureView[];
  vehicleCurrentOdometer: number;
}> {
  const supabase = await createClient();

  const [proceduresRes, currentOdometer] = await Promise.all([
    supabase
      .from("vehicle_service_procedures")
      .select(
        "*, vehicle_service_records(id, completed_at, odometer, created_at)",
      )
      .eq("vehicle_id", vehicleId)
      .order("created_at", { ascending: true }),
    getVehicleCurrentOdometer(vehicleId),
  ]);
  if (proceduresRes.error) throw proceduresRes.error;

  type JoinedRow = ServiceProcedureRow & {
    vehicle_service_records: Pick<
      ServiceRecordRow,
      "id" | "completed_at" | "odometer" | "created_at"
    >[];
  };

  const today = todayIso();

  const rows: ServiceProcedureView[] = (
    (proceduresRes.data ?? []) as unknown as JoinedRow[]
  ).map((p) => {
    const records = [...(p.vehicle_service_records ?? [])].sort((a, b) => {
      const dateCmp = b.completed_at.localeCompare(a.completed_at);
      if (dateCmp !== 0) return dateCmp;
      return b.created_at.localeCompare(a.created_at);
    });
    const last = records[0] ?? null;

    // Insurance uses explicit start/end dates — bypass the period+records logic.
    if (p.type === "insurance") {
      const remainingDays = p.insurance_end_date
        ? daysBetween(today, p.insurance_end_date)
        : null;
      let status: ServiceProcedureStatus;
      if (remainingDays == null) status = "unknown";
      else if (remainingDays <= 0) status = "overdue";
      else if (remainingDays <= 7) status = "due_soon";
      else status = "ok";
      return {
        ...p,
        last_completed_at: p.insurance_start_date ?? null,
        last_odometer: null,
        records_count: records.length,
        remaining_km: null,
        remaining_days: remainingDays,
        status,
      };
    }

    const remainingKm =
      p.period_km != null && last?.odometer != null
        ? last.odometer + p.period_km - currentOdometer
        : null;
    const remainingDays =
      p.period_days != null && last?.completed_at
        ? p.period_days - daysBetween(last.completed_at, today)
        : null;

    return {
      ...p,
      last_completed_at: last?.completed_at ?? null,
      last_odometer: last?.odometer ?? null,
      records_count: records.length,
      remaining_km: remainingKm,
      remaining_days: remainingDays,
      status: classify(
        remainingKm,
        remainingDays,
        p.period_km,
        p.period_days,
        Boolean(last),
      ),
    };
  });

  return { rows, vehicleCurrentOdometer: currentOdometer };
}

export async function getServiceProcedure(
  id: string,
): Promise<ServiceProcedureRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_service_procedures")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
