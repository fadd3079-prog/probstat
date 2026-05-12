const DEFAULT_LOCALE = "id-ID";

export function formatNumber(
  value: number | null | undefined,
  maximumFractionDigits = 2,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    maximumFractionDigits,
  }).format(value);
}

export function formatMeters(
  value: number | null | undefined,
  maximumFractionDigits = 2,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  return `${formatNumber(value, maximumFractionDigits)} m`;
}

export function formatPercent(
  value: number | null | undefined,
  maximumFractionDigits = 2,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  return `${formatNumber(value, maximumFractionDigits)}%`;
}

export function formatZScore(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  return value.toFixed(3);
}
