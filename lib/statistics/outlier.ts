import type {
  BoxPlotSummary,
  IqrOutlierResult,
  OutlierRecord,
} from "@/types/statistics";

import {
  percentile,
  sortNumbers,
  toDistanceObservations,
  type DistanceInput,
} from "./utils";

export function detectIqrOutliers(input: DistanceInput): IqrOutlierResult {
  const observations = toDistanceObservations(input);
  const sortedDistances = sortNumbers(
    observations.map((observation) => observation.distance),
  );
  const q1 = percentile(sortedDistances, 0.25);
  const q2 = percentile(sortedDistances, 0.5);
  const q3 = percentile(sortedDistances, 0.75);

  if (q1 === null || q2 === null || q3 === null) {
    return {
      q1,
      q2,
      q3,
      iqr: null,
      lowerFence: null,
      upperFence: null,
      outliers: [],
    };
  }

  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const outliers = observations
    .filter(
      (observation) =>
        observation.distance < lowerFence || observation.distance > upperFence,
    )
    .map((observation, index): OutlierRecord => {
      return {
        id: observation.id ?? String(index + 1),
        name: observation.name,
        distance: observation.distance,
        reason:
          observation.distance < lowerFence
            ? "below_lower_fence"
            : "above_upper_fence",
      };
    });

  return {
    q1,
    q2,
    q3,
    iqr,
    lowerFence,
    upperFence,
    outliers,
  };
}

export function createBoxPlotSummary(input: DistanceInput): BoxPlotSummary {
  const observations = toDistanceObservations(input);
  const sortedDistances = sortNumbers(
    observations.map((observation) => observation.distance),
  );
  const iqrResult = detectIqrOutliers(observations);

  return {
    min: sortedDistances[0] ?? null,
    q1: iqrResult.q1,
    median: iqrResult.q2,
    q3: iqrResult.q3,
    max: sortedDistances[sortedDistances.length - 1] ?? null,
    iqr: iqrResult.iqr,
    lowerFence: iqrResult.lowerFence,
    upperFence: iqrResult.upperFence,
    outliers: iqrResult.outliers,
  };
}
