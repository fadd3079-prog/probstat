export function standardNormalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

export function normalCdf(
  value: number,
  average = 0,
  standardDeviation = 1,
): number {
  if (standardDeviation <= 0) {
    if (value < average) {
      return 0;
    }

    if (value > average) {
      return 1;
    }

    return 0.5;
  }

  return standardNormalCdf((value - average) / standardDeviation);
}

function erf(value: number): number {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
      0.284496736) *
      t +
      0.254829592) *
      t *
      Math.exp(-x * x));

  return sign * y;
}
