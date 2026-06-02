"use client";

import { useMemo, useState } from "react";
import { BarChart3, CircleDot, Sigma, TableProperties } from "lucide-react";

import { FrequencyBarChart } from "@/components/distribution/FrequencyBarChart";
import { IntervalModeToggle } from "@/components/distribution/IntervalModeToggle";
import { DistanceBoxPlotCard } from "@/components/visualization/DistanceBoxPlotCard";
import { DistanceScatterChart } from "@/components/visualization/DistanceScatterChart";
import { FrequencyDonutChart } from "@/components/visualization/FrequencyDonutChart";
import { QqPlotChart } from "@/components/visualization/QqPlotChart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatFrequencyIntervalLabel,
  formatFrequencyPercentage,
} from "@/lib/format/frequency";
import { formatMeters, formatNumber } from "@/lib/format/statistics";
import {
  calculateManualFrequencyDistribution,
  calculateSturgesFrequencyDistribution,
  createBoxPlotSummary,
  generateQqPlotData,
} from "@/lib/statistics";
import type { FrequencyIntervalMode } from "@/types/frequency";
import type {
  BoxPlotSummary,
  DescriptiveStatistics,
  DistanceObservation,
} from "@/types/statistics";

type VisualizationDashboardProps = Readonly<{
  observations: readonly DistanceObservation[];
  stats: DescriptiveStatistics;
}>;

export function VisualizationDashboard({
  observations,
  stats,
}: VisualizationDashboardProps) {
  const [mode, setMode] = useState<FrequencyIntervalMode>("manual");
  const distribution = useMemo(
    () =>
      mode === "manual"
        ? calculateManualFrequencyDistribution(observations)
        : calculateSturgesFrequencyDistribution(observations),
    [mode, observations],
  );
  const qqPlot = useMemo(() => generateQqPlotData(observations), [observations]);
  const boxPlotSummary = useMemo(
    () => createBoxPlotSummary(observations),
    [observations],
  );

  return (
    <>
      <section className="col-span-12">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Mode interval visualisasi
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Histogram dan donut memakai interval yang sama agar konsisten
              dengan tabel distribusi frekuensi.
            </p>
          </div>
          <IntervalModeToggle mode={mode} onModeChange={setMode} />
        </div>
      </section>

      <section className="col-span-12">
        <VisualizationSummaryCards
          boxPlotSummary={boxPlotSummary}
          modalIntervalLabel={
            distribution.modeInterval
              ? formatFrequencyIntervalLabel(distribution.modeInterval)
              : "-"
          }
          modalPercentage={distribution.modeInterval?.percentage ?? null}
          stats={stats}
        />
      </section>

      <section className="col-span-12">
        <FrequencyBarChart distribution={distribution} />
      </section>

      <section className="col-span-12 grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <FrequencyDonutChart distribution={distribution} />
        </div>
        <div className="col-span-7">
          <DistanceScatterChart observations={observations} />
        </div>
      </section>

      <section className="col-span-12">
        <DistanceBoxPlotCard summary={boxPlotSummary} />
      </section>

      <section className="col-span-12">
        <QqPlotChart data={qqPlot} />
      </section>

      <section className="col-span-12">
        <VisualizationInterpretation
          distributionMode={mode}
          modalIntervalLabel={
            distribution.modeInterval
              ? formatFrequencyIntervalLabel(distribution.modeInterval)
              : "-"
          }
          stats={stats}
        />
      </section>
    </>
  );
}

function VisualizationSummaryCards({
  boxPlotSummary,
  modalIntervalLabel,
  modalPercentage,
  stats,
}: Readonly<{
  boxPlotSummary: BoxPlotSummary;
  modalIntervalLabel: string;
  modalPercentage: number | null;
  stats: DescriptiveStatistics;
}>) {
  const items = [
    {
      helper: "Jumlah kos aktif",
      icon: TableProperties,
      label: "Total Data",
      value: `${formatNumber(stats.n, 0)} kos`,
    },
    {
      helper: "Kelas dengan frekuensi tertinggi",
      icon: BarChart3,
      label: "Interval Terbanyak",
      value:
        modalPercentage === null
          ? modalIntervalLabel
          : `${modalIntervalLabel} (${formatFrequencyPercentage(modalPercentage)})`,
    },
    {
      helper: "Berdasarkan IQR",
      icon: CircleDot,
      label: "Outlier",
      value: `${formatNumber(boxPlotSummary.outliers.length, 0)} kos`,
    },
    {
      helper: "Rata-rata jarak sampel",
      icon: Sigma,
      label: "Mean",
      value: formatMeters(stats.mean, 2),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.label} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-950">
                    {item.value}
                  </p>
                </div>
                <div className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-600">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">{item.helper}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function VisualizationInterpretation({
  distributionMode,
  modalIntervalLabel,
  stats,
}: Readonly<{
  distributionMode: FrequencyIntervalMode;
  modalIntervalLabel: string;
  stats: DescriptiveStatistics;
}>) {
  const modeLabel =
    distributionMode === "manual" ? "interval manual" : "interval Sturges";

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Interpretasi Visual</CardTitle>
            <CardDescription>
              Ringkasan ini membaca pola jarak kos, bukan jumlah mahasiswa.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-700">
            {modeLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-700">
          Pada visualisasi {modeLabel}, interval dengan frekuensi tertinggi
          adalah {modalIntervalLabel}. Boxplot membantu melihat sebaran dan
          outlier jarak kos, sedangkan scatter plot memperlihatkan titik jarak
          yang relatif lebih dekat atau lebih jauh dari pola umum sampel.
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ukuran pusat visual tetap harus dibaca bersama statistik deskriptif:
          mean {formatMeters(stats.mean, 2)}, median{" "}
          {formatMeters(stats.median, 2)}, dan simpangan baku sampel{" "}
          {formatMeters(stats.sampleStandardDeviation, 2)}.
        </p>
      </CardContent>
    </Card>
  );
}
