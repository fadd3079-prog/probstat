export function inverseStandardNormal(probability: number): number {
  if (probability <= 0) {
    return Number.NEGATIVE_INFINITY;
  }

  if (probability >= 1) {
    return Number.POSITIVE_INFINITY;
  }

  const coefficientsA = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.38357751867269e2,
    -3.066479806614716e1,
    2.506628277459239,
  ];
  const coefficientsB = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const coefficientsC = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838,
    -2.549732539343734,
    4.374664141464968,
    2.938163982698783,
  ];
  const coefficientsD = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996,
    3.754408661907416,
  ];
  const lowerLimit = 0.02425;
  const upperLimit = 1 - lowerLimit;

  if (probability < lowerLimit) {
    const q = Math.sqrt(-2 * Math.log(probability));

    return (
      (((((coefficientsC[0] * q + coefficientsC[1]) * q + coefficientsC[2]) *
        q +
        coefficientsC[3]) *
        q +
        coefficientsC[4]) *
        q +
        coefficientsC[5]) /
      ((((coefficientsD[0] * q + coefficientsD[1]) * q + coefficientsD[2]) *
        q +
        coefficientsD[3]) *
        q +
        1)
    );
  }

  if (probability > upperLimit) {
    const q = Math.sqrt(-2 * Math.log(1 - probability));

    return -(
      (((((coefficientsC[0] * q + coefficientsC[1]) * q + coefficientsC[2]) *
        q +
        coefficientsC[3]) *
        q +
        coefficientsC[4]) *
        q +
        coefficientsC[5]) /
      ((((coefficientsD[0] * q + coefficientsD[1]) * q + coefficientsD[2]) *
        q +
        coefficientsD[3]) *
        q +
        1)
    );
  }

  const q = probability - 0.5;
  const r = q * q;

  return (
    (((((coefficientsA[0] * r + coefficientsA[1]) * r + coefficientsA[2]) *
      r +
      coefficientsA[3]) *
      r +
      coefficientsA[4]) *
      r +
      coefficientsA[5]) *
    q /
    (((((coefficientsB[0] * r + coefficientsB[1]) * r + coefficientsB[2]) *
      r +
      coefficientsB[3]) *
      r +
      coefficientsB[4]) *
      r +
      1)
  );
}
