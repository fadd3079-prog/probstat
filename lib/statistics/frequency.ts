import type {
  FrequencyClass,
  FrequencyDistribution,
  FrequencyIntervalMode,
  ManualFrequencyInterval,
} from "@/types/frequency";

import {
  formatIntervalLabel,
  formatNumber,
  sortNumbers,
  toDistances,
  type DistanceInput,
} from "./utils";

export const DEFAULT_MANUAL_INTERVALS: readonly ManualFrequencyInterval[] = [
  { label: "0-250", lowerBound: 0, upperBound: 250 },
  { label: "251-500", lowerBound: 251, upperBound: 500 },
  { label: "501-750", lowerBound: 501, upperBound: 750 },
  { label: "751-1000", lowerBound: 751, upperBound: 1000 },
  { label: "1001-1250", lowerBound: 1001, upperBound: 1250 },
  { label: "1251-1500", lowerBound: 1251, upperBound: 1500 },
  { label: "1501-1750", lowerBound: 1501, upperBound: 1750 },
  { label: "1751-2000", lowerBound: 1751, upperBound: 2000 },
  { label: ">2000", lowerBound: 2001, upperBound: null },
];

export function calculateManualFrequencyDistribution(
  input: DistanceInput,
  intervals: readonly ManualFrequencyInterval[] = DEFAULT_MANUAL_INTERVALS,
): FrequencyDistribution {
  const distances = toDistances(input);

  return buildFrequencyDistribution({
    distances,
    mode: "manual",
    intervals,
    classWidth: null,
    range: getRange(distances),
  });
}

export function calculateSturgesFrequencyDistribution(
  input: DistanceInput,
): FrequencyDistribution {
  const distances = sortNumbers(toDistances(input));

  if (distances.length === 0) {
    return emptyFrequencyDistribution("sturges");
  }

  const minimum = distances[0] ?? 0;
  const maximum = distances[distances.length - 1] ?? minimum;
  const range = maximum - minimum;
  const classCount = Math.max(
    1,
    Math.ceil(1 + 3.3 * Math.log10(distances.length)),
  );
  const classWidth = Math.max(1, Math.ceil(range / classCount));
  const intervals = Array.from({ length: classCount }, (_, index) => {
    const lowerBound = minimum + index * classWidth;
    const isLast = index === classCount - 1;
    const upperBound = isLast ? maximum : lowerBound + classWidth;

    return {
      label: formatIntervalLabel(lowerBound, upperBound),
      lowerBound,
      upperBound,
    };
  });

  return buildFrequencyDistribution({
    distances,
    mode: "sturges",
    intervals,
    classWidth,
    range,
    useExclusiveUpperBound: true,
  });
}

type BuildFrequencyDistributionOptions = Readonly<{
  distances: readonly number[];
  mode: FrequencyIntervalMode;
  intervals: readonly ManualFrequencyInterval[];
  classWidth: number | null;
  range: number | null;
  useExclusiveUpperBound?: boolean;
}>;

function buildFrequencyDistribution({
  distances,
  mode,
  intervals,
  classWidth,
  range,
  useExclusiveUpperBound = false,
}: BuildFrequencyDistributionOptions): FrequencyDistribution {
  if (distances.length === 0 && intervals.length === 0) {
    return emptyFrequencyDistribution(mode);
  }

  let cumulativeFrequency = 0;
  const classesWithoutMode = intervals.map((interval, index) => {
    const isLast = index === intervals.length - 1;
    const frequency = distances.filter((distance) =>
      isInInterval(distance, interval, {
        isLast,
        useExclusiveUpperBound,
      }),
    ).length;

    cumulativeFrequency += frequency;

    const percentage =
      distances.length === 0 ? 0 : (frequency / distances.length) * 100;
    const cumulativePercentage =
      distances.length === 0
        ? 0
        : (cumulativeFrequency / distances.length) * 100;

    return {
      id: `${mode}-${index + 1}`,
      label: interval.label,
      lowerBound: interval.lowerBound,
      upperBound: interval.upperBound,
      midpoint:
        interval.upperBound === null
          ? null
          : (interval.lowerBound + interval.upperBound) / 2,
      frequency,
      relativeFrequency: distances.length === 0 ? 0 : frequency / distances.length,
      percentage,
      cumulativeFrequency,
      cumulativePercentage,
      isModalClass: false,
    } satisfies FrequencyClass;
  });

  const maximumFrequency = Math.max(
    0,
    ...classesWithoutMode.map((frequencyClass) => frequencyClass.frequency),
  );
  const modalClassIndexes =
    maximumFrequency === 0
      ? []
      : classesWithoutMode
          .map((frequencyClass, index) => ({
            frequencyClass,
            index,
          }))
          .filter(({ frequencyClass }) => frequencyClass.frequency === maximumFrequency)
          .map(({ index }) => index);
  const classes = classesWithoutMode.map((frequencyClass, index) => ({
    ...frequencyClass,
    isModalClass: modalClassIndexes.includes(index),
  }));
  const modalIntervals = classes.filter(
    (frequencyClass) => frequencyClass.isModalClass,
  );

  return {
    mode,
    totalCount: distances.length,
    classCount: classes.length,
    classWidth,
    range,
    intervals: classes,
    classes,
    modalIntervals,
    modeInterval: modalIntervals[0] ?? null,
    hasMultipleModalIntervals: modalIntervals.length > 1,
    interpretation: buildFrequencyInterpretation(mode, modalIntervals),
  };
}

type IntervalMembershipOptions = Readonly<{
  isLast: boolean;
  useExclusiveUpperBound: boolean;
}>;

function isInInterval(
  value: number,
  interval: ManualFrequencyInterval,
  { isLast, useExclusiveUpperBound }: IntervalMembershipOptions,
): boolean {
  if (value < interval.lowerBound) {
    return false;
  }

  if (interval.upperBound === null) {
    return true;
  }

  if (useExclusiveUpperBound && !isLast) {
    return value < interval.upperBound;
  }

  return value <= interval.upperBound;
}

function emptyFrequencyDistribution(
  mode: FrequencyIntervalMode,
): FrequencyDistribution {
  return {
    mode,
    totalCount: 0,
    classCount: 0,
    classWidth: null,
    range: null,
    intervals: [],
    classes: [],
    modalIntervals: [],
    modeInterval: null,
    hasMultipleModalIntervals: false,
    interpretation: "Belum ada data jarak kos untuk disusun dalam distribusi frekuensi.",
  };
}

function getRange(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sortedValues = sortNumbers(values);
  const minimum = sortedValues[0] ?? 0;
  const maximum = sortedValues[sortedValues.length - 1] ?? minimum;

  return maximum - minimum;
}

function buildFrequencyInterpretation(
  mode: FrequencyIntervalMode,
  modalIntervals: readonly FrequencyClass[],
): string {
  if (modalIntervals.length === 0) {
    return "Belum ada kelas dengan frekuensi dominan.";
  }

  const methodLabel =
    mode === "manual" ? "interval manual" : "interval Sturges";
  const intervalLabels = modalIntervals
    .map((interval) => interval.label)
    .join(", ");
  const highestFrequency = modalIntervals[0]?.frequency ?? 0;

  if (modalIntervals.length > 1) {
    return `Distribusi ${methodLabel} memiliki beberapa kelas modus: ${intervalLabels}, masing-masing berisi ${formatNumber(highestFrequency)} kos.`;
  }

  return `Kelas modus pada distribusi ${methodLabel} adalah ${intervalLabels} dengan ${formatNumber(highestFrequency)} kos.`;
}
