import type {
  ZScoreCategory,
  ZScoreNormalizationResult,
  ZScoreRecord,
} from "@/types/statistics";

import {
  mean,
  sampleVariance,
  standardDeviation,
  toDistanceObservations,
  type DistanceInput,
} from "./utils";

export function calculateZScores(
  input: DistanceInput,
): ZScoreNormalizationResult {
  const observations = toDistanceObservations(input);
  const distances = observations.map((observation) => observation.distance);
  const average = mean(distances);
  const sampleStandardDeviation = standardDeviation(sampleVariance(distances));
  const usedFallbackForZeroDeviation =
    observations.length > 0 &&
    (sampleStandardDeviation === null || sampleStandardDeviation === 0);

  const records = observations.map((observation, index): ZScoreRecord => {
    const zScore =
      average === null ||
      sampleStandardDeviation === null ||
      sampleStandardDeviation === 0
        ? 0
        : (observation.distance - average) / sampleStandardDeviation;
    const category = categorizeZScore(zScore);

    return {
      id: observation.id ?? String(index + 1),
      name: observation.name,
      kosId: observation.id ?? String(index + 1),
      kosName: observation.name,
      namaKos: observation.name,
      distance: observation.distance,
      jarakMeter: observation.distance,
      zScore,
      category,
      interpretation: interpretZScore(zScore, category),
    };
  });

  return {
    mean: average,
    sampleStandardDeviation,
    usedFallbackForZeroDeviation,
    records,
    warning: buildZScoreWarning(observations.length, sampleStandardDeviation),
  };
}

export function categorizeZScore(zScore: number): ZScoreCategory {
  const absoluteZScore = Math.abs(zScore);

  if (absoluteZScore >= 3) {
    return "outlier";
  }

  if (absoluteZScore >= 2.5) {
    return "extreme";
  }

  if (absoluteZScore >= 2) {
    return "far_from_mean";
  }

  if (zScore >= 1) {
    return "above_mean";
  }

  if (zScore <= -1) {
    return "below_mean";
  }

  return "near_mean";
}

function interpretZScore(zScore: number, category: ZScoreCategory): string {
  if (category === "outlier") {
    return "Jarak kos sangat jauh dari rata-rata sampel berdasarkan ambang |z| >= 3.";
  }

  if (category === "extreme") {
    return "Jarak kos sangat berbeda dari rata-rata sampel, tetapi belum melewati ambang outlier z-score.";
  }

  if (category === "far_from_mean") {
    return "Jarak kos cukup jauh dari rata-rata sampel.";
  }

  if (category === "above_mean") {
    return "Jarak kos berada di atas rata-rata sampel.";
  }

  if (category === "below_mean") {
    return "Jarak kos berada di bawah rata-rata sampel.";
  }

  return `Jarak kos relatif dekat dengan rata-rata sampel (z = ${zScore.toFixed(3)}).`;
}

function buildZScoreWarning(
  n: number,
  sampleStandardDeviation: number | null,
): string | null {
  if (n === 0) {
    return "Belum ada data jarak kos untuk dinormalisasi.";
  }

  if (sampleStandardDeviation === null) {
    return "Z-score membutuhkan minimal dua data; nilai z sementara diisi 0.";
  }

  if (sampleStandardDeviation === 0) {
    return "Semua jarak sama sehingga simpangan baku 0; nilai z diisi 0.";
  }

  return null;
}
