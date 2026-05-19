import "server-only";

import {
  isDozorConfigured,
  listLocations,
  listTrackers,
  type DozorLocation,
  type DozorTracker,
} from "@/lib/dozor/client";
import { GPS_MOVING_SPEED_KMH, GPS_STALE_MS, type GpsStatus } from "@/lib/constants";
import { findPlateMatch, normalizePlate } from "@/lib/plate";
import { createClient } from "@/lib/supabase/server";

export type GpsRow = {
  vehicle_id: string;
  unit: string;
  plate: string;
  driver_full_name: string | null;
  dozor_device_uid: string | null;
  tracker_name: string | null;
  lat: number | null;
  lng: number | null;
  speed_kmh: number | null;
  last_fix_at: string | null;
  gps_status: GpsStatus;
};

export type GpsFleetResult = {
  configured: boolean;
  rows: GpsRow[];
};

export type TrackerOption = {
  uid: string;
  name: string;
  auto_gov_number: string;
};

function deriveStatus(
  uid: string | null,
  location: DozorLocation | undefined,
  tracker: DozorTracker | undefined,
  now: number,
): GpsStatus {
  if (!uid) return "unlinked";

  const fixTime = location?.server_timestamp ? Date.parse(location.server_timestamp) : NaN;
  const isStale = !Number.isFinite(fixTime) || now - fixTime > GPS_STALE_MS;
  if (!location || tracker?.connected === false || isStale) return "waiting";

  const speed = location.speed ?? 0;
  return speed >= GPS_MOVING_SPEED_KMH ? "moving" : "parked";
}

export async function listGpsFleet(): Promise<GpsFleetResult> {
  const supabase = await createClient();
  const [vehiclesRes, trackers, locations] = await Promise.all([
    supabase
      .from("vehicles_with_stats")
      .select("id, unit, plate, driver_full_name, dozor_device_uid")
      .order("plate"),
    listTrackers(),
    listLocations(),
  ]);

  if (vehiclesRes.error) throw vehiclesRes.error;
  const vehicles = vehiclesRes.data ?? [];

  const trackerByUid = new Map<string, DozorTracker>();
  for (const t of trackers) trackerByUid.set(t.uid, t);

  const locationByUid = new Map<string, DozorLocation>();
  for (const l of locations) locationByUid.set(l.device_uid, l);

  const now = Date.now();

  const rows: GpsRow[] = vehicles.map((v) => {
    // 1. Prefer the explicit link saved to DB.
    let uid = v.dozor_device_uid ?? null;
    let tracker = uid ? trackerByUid.get(uid) : undefined;

    // 2. Fallback: fuzzy plate match when no explicit link exists yet.
    // We match against the tracker `name` field (where DozoR operators
    // typically embed the plate, sometimes alongside the brand/unit).
    // findPlateMatch accepts substring containment + edit distance ≤ 2
    // after Cyrillic/Latin folding, so "MAN BO3258CC" matches "ВО 3258 СС".
    if (!uid) {
      const plateMatch = findPlateMatch(v.plate, trackers, (t) => t.name);
      if (plateMatch) {
        uid = plateMatch.uid;
        tracker = plateMatch;
      }
    }

    const location = uid ? locationByUid.get(uid) : undefined;
    const coords = location?.point?.coordinates ?? null;

    return {
      vehicle_id: v.id ?? "",
      unit: v.unit ?? "",
      plate: v.plate ?? "",
      driver_full_name: v.driver_full_name,
      dozor_device_uid: uid,
      tracker_name: tracker?.name ?? null,
      lng: coords ? coords[0] : null,
      lat: coords ? coords[1] : null,
      speed_kmh: location?.speed ?? null,
      last_fix_at: location?.server_timestamp ?? null,
      gps_status: deriveStatus(uid, location, tracker, now),
    };
  });

  return { configured: isDozorConfigured(), rows };
}

export async function listTrackerOptions(): Promise<TrackerOption[]> {
  const trackers = await listTrackers();
  // TEMP DEBUG — dump every DozoR tracker's name + plate (raw +
  // normalized) so we can compare against vehicle plates and see what
  // the fuzzy matcher is working with.
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "[dozor:trackers]",
      trackers.map((t) => ({
        uid: t.uid,
        name: t.name,
        name_normalized: normalizePlate(t.name),
        plate_raw: t.auto_gov_number,
        plate_normalized: normalizePlate(t.auto_gov_number),
      })),
    );
  }
  return trackers
    .map((t) => ({
      uid: t.uid,
      name: t.name,
      auto_gov_number: t.auto_gov_number,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "uk"));
}
