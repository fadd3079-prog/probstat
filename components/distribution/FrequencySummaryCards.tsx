import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Hash,
  Layers3,
  Ruler,
  Sigma,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFrequencyIntervalLabel } from "@/lib/format/frequency";
import { formatMeters, formatNumber } from "@/lib/format/statistics";
import type { FrequencyDistribution } from "@/types/frequency";
import type { DescriptiveStatistics } from "@/types/statistics";

type FrequencySummaryCardsProps = Readonly<{
  distribution: FrequencyDistribution;
  stats: DescriptiveStatistics;
}>;

type SummaryItem = Readonly<{
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}>;

export function FrequencySummaryCards({
  distribution,
  stats,
}: FrequencySummaryCardsProps) {
  const modalIntervals = distribution.modalIntervals;
  const highestFrequency = distribution.modeInterval?.frequency ?? 0;
  const modalLabel =
    modalIntervals.length === 0
      ? "-"
      : modalIntervals.map(formatFrequencyIntervalLabel).join(", ");
  const items: SummaryItem[] = [
    {
      label: "Jumlah Data",
      value: formatNumber(distribution.totalCount, 0),
      helper: "Kos aktif yang dianalisis",
      icon: Hash,
    },
    {
      label: "Jarak Minimum",
      value: formatMeters(stats.min, 0),
      helper: "Kos terdekat pada sampel",
      icon: Ruler,
    },
    {
      label: "Jarak Maksimum",
      value: formatMeters(stats.max, 0),
      helper: "Kos terjauh pada sampel",
      icon: TrendingUp,
    },
    {
      label: "Rentang",
      value: formatMeters(distribution.range, 0),
      helper: "Maksimum dikurangi minimum",
      icon: Sigma,
    },
    {
      label: "Jumlah Kelas",
      value: formatNumber(distribution.classCount, 0),
      helper: distribution.mode === "manual" ? "Interval manual" : "Rumus Sturges",
      icon: Layers3,
    },
    {
      label: "Interval Terbanyak",
      value: modalLabel,
      helper:
        modalIntervals.length > 1
          ? "Ada beberapa kelas modus"
          : "Kelas dengan frekuensi tertinggi",
      icon: BarChart3,
    },
    {
      label: "Frekuensi Tertinggi",
      value: formatNumber(highestFrequency, 0),
      helper: "Jumlah kos pada kelas modus",
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 p-4 pb-2">
            <div>
              <CardDescription className="text-xs">{item.label}</CardDescription>
              <CardTitle className="mt-2 break-words text-lg leading-tight">
                {item.value}
              </CardTitle>
            </div>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
              <item.icon className="size-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs leading-5 text-slate-500">{item.helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
