import { BarChart3, Ruler, Sigma, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatMeters,
  formatNumber,
  formatPercent,
} from "@/lib/format/statistics";
import type { DescriptiveStatistics } from "@/types/statistics";

type DescriptiveStatsCardsProps = Readonly<{
  stats: DescriptiveStatistics;
}>;

export function DescriptiveStatsCards({ stats }: DescriptiveStatsCardsProps) {
  const highlightCards = [
    {
      label: "Jumlah Data",
      value: formatNumber(stats.n, 0),
      helper: "Unit observasi kos-kosan aktif",
      icon: BarChart3,
    },
    {
      label: "Mean",
      value: formatMeters(stats.mean),
      helper: "Rata-rata jarak ke titik acuan",
      icon: Sigma,
    },
    {
      label: "Median",
      value: formatMeters(stats.median),
      helper: "Q2 dari jarak kos",
      icon: Ruler,
    },
    {
      label: "Standar Deviasi Sampel",
      value: formatMeters(stats.sampleStandardDeviation),
      helper: "Sebaran jarak dari rata-rata",
      icon: TrendingUp,
    },
  ];
  const rows = [
    ["Jumlah data", formatNumber(stats.n, 0), "Banyak sampel kos aktif"],
    ["Sum", formatMeters(stats.sum), "Total seluruh jarak meter"],
    ["Minimum", formatMeters(stats.min), "Jarak kos terdekat"],
    ["Maximum", formatMeters(stats.max), "Jarak kos terjauh"],
    ["Range", formatMeters(stats.range), "Maximum dikurangi minimum"],
    ["Mean", formatMeters(stats.mean), "Rata-rata aritmetika"],
    ["Median", formatMeters(stats.median), "Nilai tengah data terurut"],
    ["Raw mode", formatRawMode(stats), "Modus jarak mentah jika ada"],
    ["Q1", formatMeters(stats.q1), "Kuartil pertama"],
    ["Q2", formatMeters(stats.q2), "Kuartil kedua atau median"],
    ["Q3", formatMeters(stats.q3), "Kuartil ketiga"],
    ["IQR", formatMeters(stats.iqr), "Q3 dikurangi Q1"],
    [
      "Sample variance",
      formatNumber(stats.sampleVariance),
      "Varians sampel, pembagi n - 1",
    ],
    [
      "Sample standard deviation",
      formatMeters(stats.sampleStandardDeviation),
      "Akar varians sampel",
    ],
    [
      "Population variance",
      formatNumber(stats.populationVariance),
      "Varians populasi, pembagi n",
    ],
    [
      "Population standard deviation",
      formatMeters(stats.populationStandardDeviation),
      "Akar varians populasi",
    ],
    [
      "Coefficient of variation",
      formatPercent(stats.coefficientOfVariation),
      "Standar deviasi sampel dibanding mean",
    ],
    [
      "Outlier count",
      formatNumber(stats.outliers.length, 0),
      "Data di luar batas IQR",
    ],
  ] as const;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {highlightCards.map((item) => (
          <Card key={item.label} className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="mt-2 text-2xl">{item.value}</CardTitle>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                <item.icon className="size-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">{item.helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Ringkasan Statistik Deskriptif</CardTitle>
              <CardDescription>
                Semua nilai dihitung dari raw data kos aktif, bukan angka yang
                disimpan permanen.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              jarak_meter
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ukuran</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(([label, value, note]) => (
                <TableRow key={label}>
                  <TableCell className="font-medium text-slate-900">
                    {label}
                  </TableCell>
                  <TableCell className="font-mono text-slate-900">
                    {value}
                  </TableCell>
                  <TableCell>{note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

function formatRawMode(stats: DescriptiveStatistics): string {
  if (stats.modeRaw.length === 0) {
    return "Tidak ada modus raw";
  }

  return stats.modeRaw.map((value) => formatMeters(value)).join(", ");
}
