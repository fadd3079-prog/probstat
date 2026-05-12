import type {
  LillieforsCriticalValue,
  NormalityDecision,
  NormalityDetailRow,
  NormalityResult,
} from "@/types/normality";
import type { DistanceObservation } from "@/types/statistics";

import { standardNormalCdf } from "./normal-cdf";
import {
  mean,
  sampleVariance,
  sortNumbers,
  standardDeviation,
  toDistanceObservations,
  type DistanceInput,
} from "./utils";

const LILLIEFORS_ALPHA_005_TABLE: Readonly<Record<number, number>> = {
  4: 0.381,
  5: 0.337,
  6: 0.319,
  7: 0.3,
  8: 0.285,
  9: 0.271,
  10: 0.258,
  11: 0.249,
  12: 0.242,
  13: 0.234,
  14: 0.227,
  15: 0.22,
  16: 0.213,
  17: 0.206,
  18: 0.2,
  19: 0.195,
  20: 0.19,
  21: 0.186,
  22: 0.182,
  23: 0.179,
  24: 0.176,
  25: 0.173,
  26: 0.17,
  27: 0.168,
  28: 0.165,
  29: 0.163,
  30: 0.161,
};

export type LillieforsNormalityOptions = Readonly<{
  alpha?: number;
}>;

export function performLillieforsNormalityTest(
  input: DistanceInput,
  options: LillieforsNormalityOptions = {},
): NormalityResult {
  const alpha = options.alpha ?? 0.05;
  const observations = toDistanceObservations(input).sort(
    (a, b) => a.distance - b.distance,
  );
  const distances = observations.map((observation) => observation.distance);
  const n = observations.length;
  const average = mean(distances);
  const sampleStandardDeviation = standardDeviation(sampleVariance(distances));
  const hasUsableStandardDeviation =
    sampleStandardDeviation !== null && sampleStandardDeviation > 0;
  const rows = buildNormalityRows(
    observations,
    average,
    sampleStandardDeviation,
    hasUsableStandardDeviation,
  );
  const lHitung = hasUsableStandardDeviation
    ? Math.max(
        0,
        ...rows.map((row) => row.absoluteDifference ?? 0),
      )
    : null;
  const criticalValue = getLillieforsCriticalValue(n, alpha);
  const decision = decideNormality({
    n,
    lHitung,
    lTable: criticalValue.value,
    hasUsableStandardDeviation,
  });
  const h0Accepted =
    decision === "insufficient_data" ? null : decision === "normal";

  return {
    method: "lilliefors",
    alpha,
    n,
    mean: average,
    standardDeviation: sampleStandardDeviation,
    lHitung,
    lTable: criticalValue.value,
    lTabel: criticalValue.value,
    lTableSource: criticalValue.source,
    h0: "Data jarak kos berdistribusi normal.",
    h1: "Data jarak kos tidak berdistribusi normal.",
    decision,
    h0Accepted,
    rows,
    sampleSizeWarning: buildSampleSizeWarning(n),
    interpretation: buildNormalityInterpretation({
      n,
      alpha,
      lHitung,
      lTable: criticalValue.value,
      decision,
      hasUsableStandardDeviation,
    }),
  };
}

export function getLillieforsCriticalValue(
  n: number,
  alpha = 0.05,
): LillieforsCriticalValue {
  if (alpha !== 0.05 || n < 4) {
    return {
      value: null,
      source: "unavailable",
    };
  }

  const lookupValue = LILLIEFORS_ALPHA_005_TABLE[n];

  if (lookupValue !== undefined) {
    return {
      value: lookupValue,
      source: "lookup",
    };
  }

  return {
    value: 0.886 / Math.sqrt(n),
    source: "approximation",
  };
}

function buildNormalityRows(
  observations: readonly DistanceObservation[],
  average: number | null,
  sampleStandardDeviation: number | null,
  hasUsableStandardDeviation: boolean,
): NormalityDetailRow[] {
  return observations.map((observation, index) => {
    const zi =
      average === null ||
      !hasUsableStandardDeviation ||
      sampleStandardDeviation === null
        ? null
        : (observation.distance - average) / sampleStandardDeviation;
    const fZi = zi === null ? null : standardNormalCdf(zi);
    const empiricalCdf =
      observations.length === 0 ? null : (index + 1) / observations.length;
    const absoluteDifference =
      fZi === null || empiricalCdf === null
        ? null
        : Math.abs(fZi - empiricalCdf);

    return {
      no: index + 1,
      index: index + 1,
      kosId: observation.id ?? String(index + 1),
      kosName: observation.name,
      namaKos: observation.name,
      distance: observation.distance,
      jarakMeter: observation.distance,
      zi,
      zScore: zi,
      standardNormalCdf: fZi,
      normalCdf: fZi,
      empiricalCdf,
      absoluteDifference,
    };
  });
}

type DecideNormalityInput = Readonly<{
  n: number;
  lHitung: number | null;
  lTable: number | null;
  hasUsableStandardDeviation: boolean;
}>;

function decideNormality({
  n,
  lHitung,
  lTable,
  hasUsableStandardDeviation,
}: DecideNormalityInput): NormalityDecision {
  if (
    n < 4 ||
    !hasUsableStandardDeviation ||
    lHitung === null ||
    lTable === null
  ) {
    return "insufficient_data";
  }

  return lHitung < lTable ? "normal" : "not_normal";
}

function buildSampleSizeWarning(n: number): string {
  if (n === 0) {
    return "Belum ada data jarak kos untuk uji normalitas.";
  }

  if (n < 30) {
    return "Jumlah sampel kurang dari 30; interpretasi uji normalitas perlu dibaca dengan hati-hati.";
  }

  if (n > 100) {
    return "Jumlah sampel lebih kuat untuk analisis visual dan uji normalitas awal.";
  }

  return "Jumlah sampel sudah memenuhi batas minimal umum untuk analisis awal.";
}

type BuildNormalityInterpretationInput = Readonly<{
  n: number;
  alpha: number;
  lHitung: number | null;
  lTable: number | null;
  decision: NormalityDecision;
  hasUsableStandardDeviation: boolean;
}>;

function buildNormalityInterpretation({
  n,
  alpha,
  lHitung,
  lTable,
  decision,
  hasUsableStandardDeviation,
}: BuildNormalityInterpretationInput): string {
  if (n === 0) {
    return "Uji normalitas belum dapat dilakukan karena data jarak kos masih kosong.";
  }

  if (!hasUsableStandardDeviation) {
    return "Uji normalitas belum bermakna karena simpangan baku sampel tidak tersedia atau bernilai 0.";
  }

  if (lHitung === null || lTable === null) {
    return "Uji normalitas belum dapat diputuskan karena nilai Ltabel tidak tersedia untuk ukuran sampel atau alpha yang dipilih.";
  }

  if (decision === "normal") {
    return `Pada alpha ${alpha}, Lhitung (${lHitung.toFixed(4)}) < Ltabel (${lTable.toFixed(4)}), sehingga H0 tidak ditolak: data jarak kos dapat diperlakukan normal untuk analisis awal.`;
  }

  return `Pada alpha ${alpha}, Lhitung (${lHitung.toFixed(4)}) >= Ltabel (${lTable.toFixed(4)}), sehingga H0 ditolak: data jarak kos tidak normal. Ini bukan kegagalan data, melainkan karakteristik distribusi jarak kos.`;
}

export function sortNormalityRowsByDistance(
  rows: readonly NormalityDetailRow[],
): NormalityDetailRow[] {
  return [...rows].sort((a, b) => a.distance - b.distance);
}

export function getSortedDistances(input: DistanceInput): number[] {
  return sortNumbers(toDistanceObservations(input).map((item) => item.distance));
}
