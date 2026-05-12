export type FrequencyIntervalMode = "manual" | "sturges";

export type FrequencyClass = Readonly<{
  id: string;
  label: string;
  lowerBound: number;
  upperBound: number;
  midpoint: number;
  frequency: number;
  relativeFrequency: number;
  cumulativeFrequency: number;
  percentage: number;
  isModalClass: boolean;
}>;

export type FrequencyDistribution = Readonly<{
  mode: FrequencyIntervalMode;
  totalCount: number;
  classCount: number;
  classWidth: number | null;
  range: number | null;
  intervals: readonly FrequencyClass[];
}>;
