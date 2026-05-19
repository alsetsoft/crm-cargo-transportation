// Format as a plain decimal and append the ₴ symbol manually: the currency
// symbol from `style: "currency"` differs between Node's ICU (грн) and the
// browser's (₴), which breaks hydration in SSR-ed client components.
export function formatUah(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: 0,
  }).format(value)} ₴`;
}

export function formatUahPrecise(
  value: number | null | undefined,
  maxFractionDigits = 4,
): string {
  if (value == null) return "—";
  return `${new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  }).format(value)} ₴`;
}

export function formatNumber(value: number | null | undefined, fractionDigits = 0): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatKm(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${formatNumber(value)} км`;
}

export function formatLiters(value: number | null | undefined, per100 = false): string {
  if (value == null) return "—";
  return per100 ? `${formatNumber(value, 1)} л/100км` : `${formatNumber(value, 1)} л`;
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${formatNumber(value, 1)}%`;
}

export function formatSpeed(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${formatNumber(value)} км/год`;
}

export function formatCoords(
  lat: number | null | undefined,
  lng: number | null | undefined,
): string {
  if (lat == null || lng == null) return "—";
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
