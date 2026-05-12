export type FrequencyIntervalMode = "manual" | "sturges";

export type ManualFrequencyInterval = Readonly<{
  label: string;
  lowerBound: number;
  upperBound: number | null;
}>;

export type FrequencyClass = Readonly<{
  id: string;
  label: string;
  lowerBound: number;
  upperBound: number | null;
  midpoint: number | null;
  frequency: number;
  relativeFrequency: number;
  percentage: number;
  cumulativeFrequency: number;
  cumulativePercentage: number;
  isModalClass: boolean;
}>;

export type FrequencyDistribution = Readonly<{
  mode: FrequencyIntervalMode;
  totalCount: number;
  classCount: number;
  classWidth: number | null;
  range: number | null;
  intervals: readonly FrequencyClass[];
  classes: readonly FrequencyClass[];
  modalIntervals: readonly FrequencyClass[];
  modeInterval: FrequencyClass | null;
  hasMultipleModalIntervals: boolean;
  interpretation: string;
}>;
