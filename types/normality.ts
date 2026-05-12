export type NormalityDecision =
  | "normal"
  | "not_normal"
  | "insufficient_data";

export type NormalityDetailRow = Readonly<{
  index: number;
  kosId: string;
  namaKos: string;
  jarakMeter: number;
  zScore: number | null;
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
  decision: NormalityDecision;
  h0Accepted: boolean | null;
  rows: readonly NormalityDetailRow[];
  interpretation: string;
}>;

export type QqPlotPoint = Readonly<{
  kosId: string;
  namaKos: string;
  jarakMeter: number;
  theoreticalQuantile: number;
  sampleQuantile: number;
}>;
