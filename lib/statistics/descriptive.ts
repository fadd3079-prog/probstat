import type {
  DescriptiveStatistics,
  ModeIntervalSummary,
  VarianceSummary,
} from "@/types/statistics";

import { calculateManualFrequencyDistribution } from "./frequency";
import { detectIqrOutliers } from "./outlier";
import {
  mean,
  median,
  percentile,
  populationVariance,
  sampleVariance,
  sortNumbers,
  standardDeviation,
  sum,
  toDistances,
  type DistanceInput,
} from "./utils";

export function calculateDescriptiveStatistics(
  input: DistanceInput,
): DescriptiveStatistics {
  const distances = toDistances(input);
  const sortedDistances = sortNumbers(distances);
  const n = distances.length;
  const total = sum(distances);
  const minimum = sortedDistances[0] ?? null;
  const maximum = sortedDistances[sortedDistances.length - 1] ?? null;
  const range = minimum === null || maximum === null ? null : maximum - minimum;
  const average = mean(distances);
  const medianValue = median(distances);
  const varianceSummary = calculateVarianceSummary(distances);
  const iqrResult = detectIqrOutliers(input);
  const modeRaw = calculateModeRaw(distances);
  const frequencyDistribution = calculateManualFrequencyDistribution(input);
  const modeIntervals = frequencyDistribution.modalIntervals.map(
    (interval): ModeIntervalSummary => ({
      label: interval.label,
      frequency: interval.frequency,
      percentage: interval.percentage,
    }),
  );

  return {
    n,
    sum: total,
    min: minimum,
    max: maximum,
    range,
    mean: average,
    median: medianValue,
    modes: modeRaw,
    modeRaw,
    modeIntervals,
    modeInterval: modeIntervals[0] ?? null,
    q1: iqrResult.q1,
    q2: iqrResult.q2,
    q3: iqrResult.q3,
    iqr: iqrResult.iqr,
    lowerFence: iqrResult.lowerFence,
    upperFence: iqrResult.upperFence,
    outliers: iqrResult.outliers,
    sampleVariance: varianceSummary.sampleVariance,
    sampleStandardDeviation: varianceSummary.sampleStandardDeviation,
    populationVariance: varianceSummary.populationVariance,
    populationStandardDeviation: varianceSummary.populationStandardDeviation,
    coefficientOfVariation: calculateCoefficientOfVariation(
      average,
      varianceSummary.sampleStandardDeviation,
    ),
    skewness: calculateSkewness(distances),
    kurtosis: calculateExcessKurtosis(distances),
    percentile10: percentile(sortedDistances, 0.1),
    percentile25: percentile(sortedDistances, 0.25),
    percentile50: percentile(sortedDistances, 0.5),
    percentile75: percentile(sortedDistances, 0.75),
    percentile90: percentile(sortedDistances, 0.9),
  };
}

export function calculateModeRaw(values: readonly number[]): readonly number[] {
  if (values.length === 0) {
    return [];
  }

  const frequencyByValue = new Map<number, number>();

  values.forEach((value) => {
    frequencyByValue.set(value, (frequencyByValue.get(value) ?? 0) + 1);
  });

  const maximumFrequency = Math.max(...frequencyByValue.values());

  if (maximumFrequency <= 1) {
    return [];
  }

  return [...frequencyByValue.entries()]
    .filter(([, frequency]) => frequency === maximumFrequency)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

export function calculateVarianceSummary(
  values: readonly number[],
): VarianceSummary {
  const popVariance = populationVariance(values);
  const sampVariance = sampleVariance(values);

  return {
    populationVariance: popVariance,
    sampleVariance: sampVariance,
    populationStandardDeviation: standardDeviation(popVariance),
    sampleStandardDeviation: standardDeviation(sampVariance),
  };
}

export function calculateCoefficientOfVariation(
  average: number | null,
  sampleStandardDeviation: number | null,
): number | null {
  if (
    average === null ||
    average === 0 ||
    sampleStandardDeviation === null
  ) {
    return null;
  }

  return (sampleStandardDeviation / average) * 100;
}

export function calculateSkewness(values: readonly number[]): number | null {
  if (values.length < 2) {
    return null;
  }

  const average = mean(values);
  const popVariance = populationVariance(values);
  const popStandardDeviation = standardDeviation(popVariance);

  if (
    average === null ||
    popStandardDeviation === null ||
    popStandardDeviation === 0
  ) {
    return null;
  }

  return (
    values.reduce(
      (total, value) => total + ((value - average) / popStandardDeviation) ** 3,
      0,
    ) / values.length
  );
}

export function calculateExcessKurtosis(
  values: readonly number[],
): number | null {
  if (values.length < 2) {
    return null;
  }

  const average = mean(values);
  const popVariance = populationVariance(values);
  const popStandardDeviation = standardDeviation(popVariance);

  if (
    average === null ||
    popStandardDeviation === null ||
    popStandardDeviation === 0
  ) {
    return null;
  }

  return (
    values.reduce(
      (total, value) => total + ((value - average) / popStandardDeviation) ** 4,
      0,
    ) /
      values.length -
    3
  );
}
