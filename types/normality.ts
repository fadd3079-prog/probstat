export type NormalityDecision =
  | "normal"
  | "not_normal"
  | "insufficient_data";

export type NormalityDetailRow = Readonly<{
  no: number;
  index: number;
  kosId: string;
  kosName: string;
  namaKos: string;
  distance: number;
  jarakMeter: number;
  zi: number | null;
  zScore: number | null;
  standardNormalCdf: number | null;
  normalCdf: number | null;
  empiricalCdf: number | null;
  absoluteDifference: number | null;
}>;

export type NormalityResult = Readonly<{
  method: "lilliefors";
  alpha: number;
  n: number;
  mean: number | null;
  standardDeviation: number | null;
  lHitung: number | null;
  lTable: number | null;
  lTabel: number | null;
  lTableSource: "lookup" | "approximation" | "unavailable";
  h0: string;
  h1: string;
  decision: NormalityDecision;
  h0Accepted: boolean | null;
  rows: readonly NormalityDetailRow[];
  sampleSizeWarning: string;
  interpretation: string;
}>;

export type LillieforsCriticalValue = Readonly<{
  value: number | null;
  source: "lookup" | "approximation" | "unavailable";
}>;

export type QqPlotPoint = Readonly<{
  kosId: string;
  kosName: string;
  namaKos: string;
  distance: number;
  jarakMeter: number;
  probability: number;
  theoreticalQuantile: number;
  sampleQuantile: number;
}>;

export type QqPlotReferenceLine = Readonly<{
  slope: number | null;
  intercept: number | null;
}>;

export type QqPlotData = Readonly<{
  points: readonly QqPlotPoint[];
  referenceLine: QqPlotReferenceLine;
  interpretation: string;
  warning: string | null;
}>;
