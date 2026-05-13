"use client";

import { useMemo, useState } from "react";

import { DistributionInterpretation } from "@/components/distribution/DistributionInterpretation";
import { FrequencyBarChart } from "@/components/distribution/FrequencyBarChart";
import { FrequencySummaryCards } from "@/components/distribution/FrequencySummaryCards";
import { FrequencyTable } from "@/components/distribution/FrequencyTable";
import { IntervalModeToggle } from "@/components/distribution/IntervalModeToggle";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMeters, formatNumber } from "@/lib/format/statistics";
import {
  calculateManualFrequencyDistribution,
  calculateSturgesFrequencyDistribution,
} from "@/lib/statistics/frequency";
import type { FrequencyIntervalMode } from "@/types/frequency";
import type { DescriptiveStatistics, DistanceObservation } from "@/types/statistics";

type DistributionDashboardProps = Readonly<{
  observations: readonly DistanceObservation[];
  stats: DescriptiveStatistics;
}>;

export function DistributionDashboard({
  observations,
  stats,
}: DistributionDashboardProps) {
  const [mode, setMode] = useState<FrequencyIntervalMode>("manual");
  const distribution = useMemo(
    () =>
      mode === "manual"
        ? calculateManualFrequencyDistribution(observations)
        : calculateSturgesFrequencyDistribution(observations),
    [mode, observations],
  );

  return (
    <>
      <section className="col-span-12">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Mode interval distribusi
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Pilih interval manual atau interval otomatis berdasarkan rumus
              Sturges.
            </p>
          </div>
          <IntervalModeToggle mode={mode} onModeChange={setMode} />
        </div>
      </section>

      {mode === "sturges" ? (
        <section className="col-span-12">
          <SturgesFormulaCard distributionClassCount={distribution.classCount} stats={stats} />
        </section>
      ) : null}

      <section className="col-span-12">
        <FrequencySummaryCards distribution={distribution} stats={stats} />
      </section>

      <section className="col-span-12">
        <FrequencyBarChart distribution={distribution} />
      </section>

      <section className="col-span-12">
        <FrequencyTable distribution={distribution} />
      </section>

      <section className="col-span-12">
        <DistributionInterpretation distribution={distribution} />
      </section>
    </>
  );
}

function SturgesFormulaCard({
  distributionClassCount,
  stats,
}: Readonly<{
  distributionClassCount: number;
  stats: DescriptiveStatistics;
}>) {
  const rawClassCount =
    stats.n > 0 ? 1 + 3.3 * Math.log10(stats.n) : null;
  const rawIntervalWidth =
    rawClassCount && stats.range !== null
      ? stats.range / Math.ceil(rawClassCount)
      : null;

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Rumus Interval Sturges</CardTitle>
            <CardDescription>
              Perhitungan kelas otomatis berdasarkan jumlah data kos aktif.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-slate-200 text-slate-600">
            k = {formatNumber(distributionClassCount, 0)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <FormulaItem
            label="Jumlah kelas"
            formula="k = 1 + 3.3 log10(n)"
            value={
              rawClassCount === null
                ? "-"
                : `${formatNumber(rawClassCount, 2)} dibulatkan menjadi ${formatNumber(
                    distributionClassCount,
                    0,
                  )}`
            }
          />
          <FormulaItem
            label="Range"
            formula="range = max - min"
            value={formatMeters(stats.range, 0)}
          />
          <FormulaItem
            label="Lebar interval"
            formula="interval width = range / k"
            value={formatMeters(rawIntervalWidth, 2)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function FormulaItem({
  formula,
  label,
  value,
}: Readonly<{
  formula: string;
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-mono text-sm text-slate-700">{formula}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
