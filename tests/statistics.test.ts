import { describe, expect, it } from "vitest";

import {
  calculateDescriptiveStatistics,
  calculateManualFrequencyDistribution,
  calculateSturgesFrequencyDistribution,
  calculateZScores,
  createBoxPlotSummary,
  detectIqrOutliers,
  generateQqPlotData,
  getLillieforsCriticalValue,
  inverseStandardNormal,
  performLillieforsNormalityTest,
  standardNormalCdf,
} from "../lib/statistics";

describe("descriptive statistics", () => {
  it("calculates deterministic dataset A correctly", () => {
    const dataset = [150, 170, 263, 393, 411, 412, 446, 534, 554, 557, 648, 698];
    const result = calculateDescriptiveStatistics(dataset);

    expect(result.n).toBe(12);
    expect(result.min).toBe(150);
    expect(result.max).toBe(698);
    expect(result.range).toBe(548);
    expect(result.sum).toBe(5236);
    expect(result.mean).toBeCloseTo(436.333333);
    expect(result.median).toBe(429);
    expect(result.q2).toBe(result.median);
  });

  it("calculates central tendency, dispersion, raw mode, and IQR fences", () => {
    const result = calculateDescriptiveStatistics([100, 200, 300, 300, 500]);

    expect(result.n).toBe(5);
    expect(result.sum).toBe(1400);
    expect(result.min).toBe(100);
    expect(result.max).toBe(500);
    expect(result.range).toBe(400);
    expect(result.mean).toBe(280);
    expect(result.median).toBe(300);
    expect(result.modeRaw).toEqual([300]);
    expect(result.q1).toBe(200);
    expect(result.q2).toBe(300);
    expect(result.q3).toBe(300);
    expect(result.iqr).toBe(100);
    expect(result.lowerFence).toBe(50);
    expect(result.upperFence).toBe(450);
    expect(result.outliers).toHaveLength(1);
    expect(result.outliers[0]?.distance).toBe(500);
    expect(result.sampleVariance).toBeCloseTo(22000);
    expect(result.sampleStandardDeviation).toBeCloseTo(148.32397);
    expect(result.populationVariance).toBeCloseTo(17600);
    expect(result.populationStandardDeviation).toBeCloseTo(132.66499);
    expect(result.coefficientOfVariation).toBeCloseTo(52.97284);
  });

  it("handles empty data safely", () => {
    const result = calculateDescriptiveStatistics([]);

    expect(result.n).toBe(0);
    expect(result.sum).toBe(0);
    expect(result.mean).toBeNull();
    expect(result.sampleVariance).toBeNull();
    expect(result.populationVariance).toBeNull();
    expect(result.modeRaw).toEqual([]);
    expect(result.outliers).toEqual([]);
  });

  it("handles constant data safely", () => {
    const result = calculateDescriptiveStatistics([100, 100, 100, 100]);

    expect(result.n).toBe(4);
    expect(result.mean).toBe(100);
    expect(result.median).toBe(100);
    expect(result.sampleVariance).toBe(0);
    expect(result.sampleStandardDeviation).toBe(0);
    expect(result.outliers).toEqual([]);
  });

  it("handles n = 1 safely", () => {
    const result = calculateDescriptiveStatistics([500]);

    expect(result.n).toBe(1);
    expect(result.mean).toBe(500);
    expect(result.median).toBe(500);
    expect(result.sampleVariance).toBeNull();
    expect(result.sampleStandardDeviation).toBeNull();
    expect(result.populationVariance).toBe(0);
    expect(result.populationStandardDeviation).toBe(0);
  });
});

describe("frequency distribution", () => {
  it("builds expected manual interval frequencies for dataset A", () => {
    const result = calculateManualFrequencyDistribution([
      150, 170, 263, 393, 411, 412, 446, 534, 554, 557, 648, 698,
    ]);

    expect(result.totalCount).toBe(12);
    expect(result.intervals.map((interval) => interval.frequency)).toEqual([
      2, 5, 5, 0, 0, 0, 0, 0, 0,
    ]);
    expect(
      result.intervals.reduce((total, interval) => total + interval.frequency, 0),
    ).toBe(12);
    expect(result.hasMultipleModalIntervals).toBe(true);
  });

  it("puts boundary values in the correct manual intervals", () => {
    const result = calculateManualFrequencyDistribution([
      250, 251, 500, 501, 750, 751, 1000, 1001, 1250, 1251, 1500, 1501,
      1750, 1751, 2000, 2001,
    ]);

    expect(result.totalCount).toBe(16);
    expect(result.intervals.map((interval) => interval.frequency)).toEqual([
      1, 2, 2, 2, 2, 2, 2, 2, 1,
    ]);
    expect(result.intervals.at(-1)?.cumulativeFrequency).toBe(16);
    expect(result.intervals.at(-1)?.cumulativePercentage).toBe(100);
  });

  it("builds the PRD manual interval frequency distribution", () => {
    const result = calculateManualFrequencyDistribution([
      100, 250, 251, 500, 600, 2100,
    ]);

    expect(result.totalCount).toBe(6);
    expect(result.classCount).toBe(9);
    expect(result.intervals[0]?.label).toBe("0-250");
    expect(result.intervals[0]?.frequency).toBe(2);
    expect(result.intervals[1]?.frequency).toBe(2);
    expect(result.intervals[2]?.frequency).toBe(1);
    expect(result.intervals[8]?.frequency).toBe(1);
    expect(result.modalIntervals.map((interval) => interval.label)).toEqual([
      "0-250",
      "251-500",
    ]);
    expect(result.hasMultipleModalIntervals).toBe(true);
  });

  it("builds a Sturges interval distribution", () => {
    const result = calculateSturgesFrequencyDistribution([10, 20, 30, 40, 50]);

    expect(result.totalCount).toBe(5);
    expect(result.classCount).toBe(4);
    expect(result.classWidth).toBe(10);
    expect(result.range).toBe(40);
    expect(
      result.intervals.reduce((total, interval) => total + interval.frequency, 0),
    ).toBe(5);
  });

  it("covers all values in a Sturges distribution when all distances are equal", () => {
    const result = calculateSturgesFrequencyDistribution([100, 100, 100, 100]);

    expect(result.totalCount).toBe(4);
    expect(result.classCount).toBe(1);
    expect(result.classWidth).toBe(0);
    expect(result.intervals[0]).toMatchObject({
      lowerBound: 100,
      upperBound: 100,
      frequency: 4,
    });
    expect(
      result.intervals.reduce((total, interval) => total + interval.frequency, 0),
    ).toBe(4);
  });
});

describe("z-score normalization", () => {
  it("uses sample standard deviation for each kos z-score", () => {
    const result = calculateZScores([10, 20, 30]);

    expect(result.mean).toBe(20);
    expect(result.sampleStandardDeviation).toBe(10);
    expect(result.records.map((record) => record.zScore)).toEqual([-1, 0, 1]);
    expect(result.records[0]?.category).toBe("below_mean");
    expect(result.records[1]?.category).toBe("near_mean");
    expect(result.records[2]?.category).toBe("above_mean");
  });

  it("falls back safely when standard deviation is zero", () => {
    const result = calculateZScores([100, 100, 100, 100]);

    expect(result.usedFallbackForZeroDeviation).toBe(true);
    expect(result.records.map((record) => record.zScore)).toEqual([0, 0, 0, 0]);
    expect(result.warning).toContain("simpangan baku 0");
  });

  it("handles a single value safely", () => {
    const result = calculateZScores([500]);

    expect(result.mean).toBe(500);
    expect(result.sampleStandardDeviation).toBeNull();
    expect(result.usedFallbackForZeroDeviation).toBe(true);
    expect(result.records[0]?.zScore).toBe(0);
  });
});

describe("IQR outlier detection", () => {
  it("detects distances outside the Tukey fences", () => {
    const result = detectIqrOutliers([10, 12, 14, 16, 100]);

    expect(result.q1).toBe(12);
    expect(result.q2).toBe(14);
    expect(result.q3).toBe(16);
    expect(result.iqr).toBe(4);
    expect(result.lowerFence).toBe(6);
    expect(result.upperFence).toBe(22);
    expect(result.outliers).toEqual([
      {
        id: "5",
        name: "Kos 5",
        distance: 100,
        reason: "above_upper_fence",
      },
    ]);
  });

  it("creates box plot summary data", () => {
    const result = createBoxPlotSummary([10, 12, 14, 16, 100]);

    expect(result.min).toBe(10);
    expect(result.median).toBe(14);
    expect(result.max).toBe(100);
    expect(result.outliers).toHaveLength(1);
  });

  it("flags the dataset D extreme distance as an outlier", () => {
    const result = detectIqrOutliers([100, 120, 130, 140, 150, 160, 1000]);

    expect(result.q1).toBe(125);
    expect(result.q2).toBe(140);
    expect(result.q3).toBe(155);
    expect(result.upperFence).toBe(200);
    expect(result.outliers).toHaveLength(1);
    expect(result.outliers[0]?.distance).toBe(1000);
  });
});

describe("normal CDF helper", () => {
  it("approximates standard normal probabilities", () => {
    expect(standardNormalCdf(0)).toBeCloseTo(0.5, 5);
    expect(standardNormalCdf(1)).toBeCloseTo(0.84134, 4);
    expect(standardNormalCdf(-1)).toBeCloseTo(0.15866, 4);
  });

  it("approximates inverse standard normal quantiles", () => {
    expect(inverseStandardNormal(0.5)).toBeCloseTo(0, 6);
    expect(inverseStandardNormal(0.975)).toBeCloseTo(1.95996, 4);
  });
});

describe("Lilliefors-style normality test", () => {
  it("builds the normality table and Lhitung value", () => {
    const result = performLillieforsNormalityTest([
      { id: "a", name: "Kos A", distance: 10 },
      { id: "b", name: "Kos B", distance: 20 },
      { id: "c", name: "Kos C", distance: 30 },
      { id: "d", name: "Kos D", distance: 40 },
      { id: "e", name: "Kos E", distance: 50 },
    ]);

    expect(result.method).toBe("lilliefors");
    expect(result.n).toBe(5);
    expect(result.mean).toBe(30);
    expect(result.standardDeviation).toBeCloseTo(15.811388);
    expect(result.lTable).toBe(0.337);
    expect(result.lTabel).toBe(0.337);
    expect(result.lTableSource).toBe("lookup");
    expect(result.rows).toHaveLength(5);
    expect(result.rows[0]).toMatchObject({
      no: 1,
      kosName: "Kos A",
      distance: 10,
      empiricalCdf: 0.2,
    });
    expect(result.rows[0]?.zi).toBeCloseTo(-1.26491);
    expect(result.lHitung).toBeCloseTo(
      Math.max(
        ...result.rows.map((row) => row.absoluteDifference ?? 0),
      ),
    );
    expect(["normal", "not_normal"]).toContain(result.decision);
  });

  it("reports insufficient data when the test cannot be computed safely", () => {
    const result = performLillieforsNormalityTest([100]);

    expect(result.decision).toBe("insufficient_data");
    expect(result.lHitung).toBeNull();
    expect(result.rows[0]?.zi).toBeNull();
  });

  it("reports insufficient data for constant distances", () => {
    const result = performLillieforsNormalityTest([100, 100, 100, 100]);

    expect(result.decision).toBe("insufficient_data");
    expect(result.standardDeviation).toBe(0);
    expect(result.lHitung).toBeNull();
  });

  it("returns lookup or approximation Ltabel values", () => {
    expect(getLillieforsCriticalValue(5)).toEqual({
      value: 0.337,
      source: "lookup",
    });
    expect(getLillieforsCriticalValue(100)).toEqual({
      value: 0.886 / 10,
      source: "approximation",
    });
    expect(getLillieforsCriticalValue(3)).toEqual({
      value: null,
      source: "unavailable",
    });
  });
});

describe("QQ plot data generation", () => {
  it("generates theoretical and sample quantiles", () => {
    const result = generateQqPlotData([10, 20, 30]);

    expect(result.points).toHaveLength(3);
    expect(result.points[0]?.probability).toBeCloseTo(1 / 6);
    expect(result.points[1]?.probability).toBeCloseTo(0.5);
    expect(result.points[1]?.theoreticalQuantile).toBeCloseTo(0);
    expect(result.points[1]?.sampleQuantile).toBe(20);
    expect(result.referenceLine.slope).toBe(10);
    expect(result.referenceLine.intercept).toBe(20);
  });

  it("keeps QQ plot, normality, frequency, and boxplot counts consistent", () => {
    const dataset = [150, 170, 263, 393, 411, 412, 446, 534, 554, 557, 648, 698];
    const descriptive = calculateDescriptiveStatistics(dataset);
    const frequency = calculateManualFrequencyDistribution(dataset);
    const normality = performLillieforsNormalityTest(dataset);
    const qqPlot = generateQqPlotData(dataset);
    const boxplot = createBoxPlotSummary(dataset);

    expect(frequency.totalCount).toBe(descriptive.n);
    expect(normality.n).toBe(descriptive.n);
    expect(qqPlot.points).toHaveLength(descriptive.n);
    expect(boxplot.outliers).toHaveLength(descriptive.outliers.length);
  });
});
