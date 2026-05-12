import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Database,
  MapPinned,
  Ruler,
  Sigma,
  TrendingUp,
} from "lucide-react";

import { MethodologyCard } from "@/components/dashboard/methodology-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMeters, formatNumber } from "@/lib/format/statistics";
import { fetchActiveKosData, toDistanceObservationsFromKosData } from "@/lib/kos/fetch-kos-data";
import { MIN_SAMPLE_SIZE } from "@/lib/constants";
import { calculateDescriptiveStatistics } from "@/lib/statistics";

export default async function DashboardPage() {
  const { data: kosData, error } = await fetchActiveKosData();
  const observations = toDistanceObservationsFromKosData(kosData);
  const stats = calculateDescriptiveStatistics(observations);
  const reviewCount = kosData.filter(
    (record) => record.dataQualityStatus !== "valid",
  ).length;
  const kpiItems = [
    {
      label: "Total Kos",
      value: formatNumber(stats.n, 0),
      helper:
        stats.n >= MIN_SAMPLE_SIZE
          ? "Target awal 30 kos terpenuhi"
          : `Target minimal ${MIN_SAMPLE_SIZE} kos`,
      icon: MapPinned,
    },
    {
      label: "Median Jarak",
      value: formatMeters(stats.median),
      helper: "Nilai tengah jarak kos aktif",
      icon: Ruler,
    },
    {
      label: "Standar Deviasi",
      value: formatMeters(stats.sampleStandardDeviation),
      helper: "Menggunakan simpangan baku sampel",
      icon: Sigma,
    },
    {
      label: "Rentang Jarak",
      value: formatMeters(stats.range),
      helper: `${formatMeters(stats.min)} - ${formatMeters(stats.max)}`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Dashboard Analisis Jarak Kos FT Unsoed
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Jarak Kos-kosan Mahasiswa di Sekitar FT Unsoed ke Gerbang Kampus
            </h1>
          </div>
          <Badge
            variant="outline"
            className={
              stats.n >= MIN_SAMPLE_SIZE
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-300 text-slate-600"
            }
          >
            {stats.n >= MIN_SAMPLE_SIZE
              ? "Target awal terpenuhi"
              : "Dataset belum final"}
          </Badge>
        </div>
      </section>

      {error ? (
        <section className="col-span-12">
          <Alert variant="destructive">
            <AlertTriangle className="size-4" aria-hidden="true" />
            <AlertTitle>Dashboard gagal memuat data kos</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </section>
      ) : null}

      {kpiItems.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}

      <section className="col-span-5">
        <MethodologyCard />
      </section>

      <section className="col-span-7">
        <Card className="h-full border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Ringkasan Dataset Aktif</CardTitle>
                <CardDescription>
                  Raw data kos aktif menjadi sumber seluruh statistik turunan.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={
                  reviewCount > 0
                    ? "border-amber-200 text-amber-700"
                    : "border-emerald-200 text-emerald-700"
                }
              >
                {reviewCount > 0
                  ? `${formatNumber(reviewCount, 0)} perlu review`
                  : "Data valid"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {stats.n === 0 ? (
              <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
                <div className="max-w-sm text-center">
                  <Database
                    className="mx-auto size-10 text-slate-400"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-medium text-slate-800">
                    Belum ada data kos aktif.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Setelah data dimasukkan, dashboard akan menampilkan KPI
                    jarak, statistik deskriptif, dan status target sampel.
                  </p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/input">
                      Buka Input Data
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid min-h-56 content-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="grid grid-cols-3 gap-4">
                  <DatasetSummaryItem
                    label="Jarak terdekat"
                    value={formatMeters(stats.min)}
                  />
                  <DatasetSummaryItem
                    label="Jarak terjauh"
                    value={formatMeters(stats.max)}
                  />
                  <DatasetSummaryItem
                    label="Outlier IQR"
                    value={formatNumber(stats.outliers.length, 0)}
                  />
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  Dataset ini menganalisis jarak kos-kosan sebagai unit
                  observasi. Hasil statistik tidak mewakili jumlah mahasiswa
                  yang tinggal pada jarak tertentu.
                </p>
                <Button asChild variant="outline" className="w-fit">
                  <Link href="/statistik">
                    Lihat Statistik Lengkap
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function DatasetSummaryItem({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-mono text-lg font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}
