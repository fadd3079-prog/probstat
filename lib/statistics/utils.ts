import type { DistanceObservation } from "@/types/statistics";

export type DistanceInput = readonly number[] | readonly DistanceObservation[];

export function toDistanceObservations(input: DistanceInput): DistanceObservation[] {
  return input
    .map((item, index) => {
      if (typeof item === "number") {
        return {
          id: String(index + 1),
          name: `Kos ${index + 1}`,
          distance: item,
        };
      }

      return {
        id: item.id ?? String(index + 1),
        name: item.name,
        distance: item.distance,
      };
    })
    .filter((item) => Number.isFinite(item.distance));
}

export function toDistances(input: DistanceInput): number[] {
  return toDistanceObservations(input).map((item) => item.distance);
}

export function sortNumbers(values: readonly number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function mean(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return sum(values) / values.length;
}

export function percentile(
  sortedValues: readonly number[],
  percentileValue: number,
): number | null {
  if (sortedValues.length === 0) {
    return null;
  }

  if (sortedValues.length === 1) {
    return sortedValues[0] ?? null;
  }

  const boundedPercentile = Math.min(Math.max(percentileValue, 0), 1);
  const index = (sortedValues.length - 1) * boundedPercentile;
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  const lowerValue = sortedValues[lowerIndex];
  const upperValue = sortedValues[upperIndex];

  if (lowerValue === undefined || upperValue === undefined) {
    return null;
  }

  if (lowerIndex === upperIndex) {
    return lowerValue;
  }

  return lowerValue + (upperValue - lowerValue) * (index - lowerIndex);
}

export function median(values: readonly number[]): number | null {
  return percentile(sortNumbers(values), 0.5);
}

export function sampleVariance(values: readonly number[]): number | null {
  if (values.length < 2) {
    return null;
  }

  const average = mean(values);

  if (average === null) {
    return null;
  }

  const squaredDifferences = values.reduce(
    (total, value) => total + (value - average) ** 2,
    0,
  );

  return squaredDifferences / (values.length - 1);
}

export function populationVariance(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const average = mean(values);

  if (average === null) {
    return null;
  }

  const squaredDifferences = values.reduce(
    (total, value) => total + (value - average) ** 2,
    0,
  );

  return squaredDifferences / values.length;
}

export function standardDeviation(variance: number | null): number | null {
  if (variance === null) {
    return null;
  }

  return Math.sqrt(variance);
}

export function formatIntervalLabel(
  lowerBound: number,
  upperBound: number | null,
): string {
  if (upperBound === null) {
    return `> ${lowerBound - 1}`;
  }

  return `${formatNumber(lowerBound)}-${formatNumber(upperBound)}`;
}

export function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
