import type { FrequencyClass } from "@/types/frequency";

import { formatMeters, formatNumber, formatPercent } from "./statistics";

export function formatFrequencyIntervalLabel(
  frequencyClass: Pick<FrequencyClass, "lowerBound" | "upperBound">,
): string {
  if (frequencyClass.upperBound === null) {
    return `> ${formatMeters(frequencyClass.lowerBound - 1, 0)}`;
  }

  return `${formatNumber(frequencyClass.lowerBound, 0)}-${formatMeters(
    frequencyClass.upperBound,
    0,
  )}`;
}

export function formatFrequencyBound(value: number | null): string {
  if (value === null) {
    return "Tidak terbatas";
  }

  return formatMeters(value, 0);
}

export function formatFrequencyMidpoint(value: number | null): string {
  return formatMeters(value, 2);
}

export function formatRelativeFrequency(value: number): string {
  return formatNumber(value, 4);
}

export function formatFrequencyPercentage(value: number): string {
  return formatPercent(value, 2);
}
