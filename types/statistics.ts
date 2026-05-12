export type DescriptiveStatistics = Readonly<{
  n: number;
  sum: number;
  min: number | null;
  max: number | null;
  mean: number | null;
  median: number | null;
  modes: readonly number[];
  range: number | null;
  populationVariance: number | null;
  sampleVariance: number | null;
  populationStandardDeviation: number | null;
  sampleStandardDeviation: number | null;
  q1: number | null;
  q3: number | null;
  iqr: number | null;
}>;

export type ZScoreCategory =
  | "below_mean"
  | "near_mean"
  | "above_mean"
  | "outlier";

export type ZScoreRecord = Readonly<{
  kosId: string;
  namaKos: string;
  jarakMeter: number;
  zScore: number | null;
  category: ZScoreCategory;
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
  outliers: readonly ZScoreRecord[];
}>;
