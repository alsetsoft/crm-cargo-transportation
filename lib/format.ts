export function formatUah(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatUahPrecise(
  value: number | null | undefined,
  maxFractionDigits = 4,
): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
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
