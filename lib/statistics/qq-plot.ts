import type { QqPlotData, QqPlotPoint } from "@/types/normality";

import { inverseStandardNormal } from "./inverse-normal";
import {
  mean,
  sampleVariance,
  standardDeviation,
  toDistanceObservations,
  type DistanceInput,
} from "./utils";

export function generateQqPlotData(input: DistanceInput): QqPlotData {
  const observations = toDistanceObservations(input).sort(
    (a, b) => a.distance - b.distance,
  );
  const distances = observations.map((observation) => observation.distance);
  const average = mean(distances);
  const sampleStandardDeviation = standardDeviation(sampleVariance(distances));
  const points = observations.map((observation, index): QqPlotPoint => {
    const probability = (index + 0.5) / observations.length;

    return {
      kosId: observation.id ?? String(index + 1),
      kosName: observation.name,
      namaKos: observation.name,
      distance: observation.distance,
      jarakMeter: observation.distance,
      probability,
      theoreticalQuantile: inverseStandardNormal(probability),
      sampleQuantile: observation.distance,
    };
  });

  return {
    points,
    referenceLine: {
      slope: sampleStandardDeviation,
      intercept: average,
    },
    interpretation: buildQqInterpretation(points.length, sampleStandardDeviation),
    warning: buildQqWarning(points.length, sampleStandardDeviation),
  };
}

function buildQqInterpretation(
  n: number,
  sampleStandardDeviation: number | null,
): string {
  if (n === 0) {
    return "QQ plot belum dapat dibuat karena data jarak kos masih kosong.";
  }

  if (sampleStandardDeviation === null || sampleStandardDeviation === 0) {
    return "QQ plot terbatas karena variasi jarak tidak cukup untuk membentuk garis acuan normal.";
  }

  return "QQ plot membandingkan kuantil jarak kos sampel dengan kuantil teoritis normal.";
}

function buildQqWarning(
  n: number,
  sampleStandardDeviation: number | null,
): string | null {
  if (n === 0) {
    return "Belum ada data untuk QQ plot.";
  }

  if (n < 4) {
    return "QQ plot dengan kurang dari 4 data hanya bersifat indikatif.";
  }

  if (sampleStandardDeviation === null || sampleStandardDeviation === 0) {
    return "Simpangan baku tidak tersedia atau bernilai 0.";
  }

  return null;
}
