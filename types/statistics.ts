export type DistanceObservation = Readonly<{
  id?: string;
  name: string;
  distance: number;
}>;

export type ModeIntervalSummary = Readonly<{
  label: string;
  frequency: number;
  percentage: number;
}>;

export type OutlierReason = "below_lower_fence" | "above_upper_fence";

export type OutlierRecord = Readonly<{
  id: string;
  name: string;
  distance: number;
  reason: OutlierReason;
}>;

export type IqrOutlierResult = Readonly<{
  q1: number | null;
  q2: number | null;
  q3: number | null;
  iqr: number | null;
  lowerFence: number | null;
  upperFence: number | null;
  outliers: readonly OutlierRecord[];
}>;

export type VarianceSummary = Readonly<{
  populationVariance: number | null;
  sampleVariance: number | null;
  populationStandardDeviation: number | null;
  sampleStandardDeviation: number | null;
}>;

export type DescriptiveStatistics = Readonly<{
  n: number;
  sum: number;
  min: number | null;
  max: number | null;
  range: number | null;
  mean: number | null;
  median: number | null;
  modes: readonly number[];
  modeRaw: readonly number[];
  modeIntervals: readonly ModeIntervalSummary[];
  modeInterval: ModeIntervalSummary | null;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  iqr: number | null;
  lowerFence: number | null;
  upperFence: number | null;
  outliers: readonly OutlierRecord[];
  sampleVariance: number | null;
  sampleStandardDeviation: number | null;
  populationVariance: number | null;
  populationStandardDeviation: number | null;
  coefficientOfVariation: number | null;
  skewness: number | null;
  kurtosis: number | null;
  percentile10: number | null;
  percentile25: number | null;
  percentile50: number | null;
  percentile75: number | null;
  percentile90: number | null;
}>;

export type ZScoreCategory =
  | "below_mean"
  | "near_mean"
  | "above_mean"
  | "far_from_mean"
  | "extreme"
  | "outlier";

export type ZScoreRecord = Readonly<{
  id: string;
  name: string;
  kosId: string;
  kosName: string;
  namaKos: string;
  distance: number;
  jarakMeter: number;
  zScore: number;
  category: ZScoreCategory;
  interpretation: string;
}>;

export type ZScoreNormalizationResult = Readonly<{
  mean: number | null;
  sampleStandardDeviation: number | null;
  usedFallbackForZeroDeviation: boolean;
  records: readonly ZScoreRecord[];
  warning: string | null;
}>;

export type BoxPlotSummary = Readonly<{
  min: number | null;
  q1: number | null;
  median: number | null;
  q3: number | null;
  max: number | null;
  iqr: number | null;
  lowerFence: number | null;
  upperFence: number | null;
  outliers: readonly OutlierRecord[];
}>;
