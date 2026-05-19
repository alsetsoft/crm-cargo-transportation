import "server-only";

import { unstable_cache } from "next/cache";

// Policy: this module only ever issues GET requests against the DozoR Web-API.
// The CRM never POSTs to DozoR — /sync/*/set and /sync/*/del endpoints are
// intentionally out of reach. If a future feature requires writes, add a new
// module rather than relaxing this rule.

export type DozorTracker = {
  uid: string;
  name: string;
  auto_gov_number: string;
  connected: boolean;
  stop_time: string | null;
};

export type DozorLocation = {
  device_uid: string;
  tracker_timestamp: string;
  server_timestamp: string;
  // GeoJSON Point. Coordinates are [lng, lat] per RFC 7946.
  point: { type: "Point"; coordinates: [number, number] } | null;
  satellites: number | null;
  speed: number | null;
  altitude: number | null;
  azimuth: number | null;
  system_mode: number | null;
};

export function isDozorConfigured(): boolean {
  return Boolean(process.env.DOZOR_API_BASE_URL && process.env.DOZOR_API_KEY);
}

const REQUEST_TIMEOUT_MS = 8000;

async function dozorGet<T>(path: string): Promise<T | null> {
  const baseUrl = process.env.DOZOR_API_BASE_URL;
  const key = process.env.DOZOR_API_KEY;
  if (!baseUrl || !key) return null;

  const separator = path.includes("?") ? "&" : "?";
  const url = `${baseUrl.replace(/\/$/, "")}${path}${separator}key=${encodeURIComponent(key)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[dozor] GET ${path} → ${res.status} ${res.statusText}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[dozor] GET ${path} failed:`, err instanceof Error ? err.message : err);
    return null;
  }
}

// DozoR list-retrieve endpoints return either a plain array (no last_modified
// filter) or [data0, data1] where data0 is the array and data1 is deletions.
// We always want data0.
function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    if (payload.length === 2 && Array.isArray(payload[0]) && (payload[1] === null || Array.isArray(payload[1]))) {
      return payload[0] as T[];
    }
    return payload as T[];
  }
  return [];
}

export const listTrackers = unstable_cache(
  async (): Promise<DozorTracker[]> => {
    const payload = await dozorGet<unknown>("/sync/devices/get");
    return unwrapList<DozorTracker>(payload);
  },
  ["dozor:trackers"],
  { revalidate: 15, tags: ["dozor"] },
);

export const listLocations = unstable_cache(
  async (): Promise<DozorLocation[]> => {
    const payload = await dozorGet<unknown>("/sync/devices/location/get");
    return unwrapList<DozorLocation>(payload);
  },
  ["dozor:locations"],
  { revalidate: 15, tags: ["dozor"] },
);
