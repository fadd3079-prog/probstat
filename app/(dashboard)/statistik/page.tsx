import Link from "next/link";
import { Database, Plus, ShieldAlert } from "lucide-react";

import { DataRequirementNotice } from "@/components/stats/DataRequirementNotice";
import { DescriptiveStatsCards } from "@/components/stats/DescriptiveStatsCards";
import { OutlierPanel } from "@/components/stats/OutlierPanel";
import { StatisticsInterpretation } from "@/components/stats/StatisticsInterpretation";
import { ZScoreTable } from "@/components/stats/ZScoreTable";
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
import {
  calculateDescriptiveStatistics,
  calculateZScores,
  detectIqrOutliers,
} from "@/lib/statistics";
import {
  fetchActiveKosData,
  toDistanceObservationsFromKosData,
} from "@/lib/kos/fetch-kos-data";
import { TARGET_DESTINATION } from "@/lib/constants";

export default async function StatistikPage() {
  const { data: kosData, error } = await fetchActiveKosData();
  const observations = toDistanceObservationsFromKosData(kosData);
  const descriptiveStats = calculateDescriptiveStatistics(observations);
  const zScoreResult = calculateZScores(observations);
  const outlierResult = detectIqrOutliers(observations);

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Statistik Deskriptif
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Analisis Jarak Kos ke Gerbang FT Unsoed
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Perhitungan menggunakan data kos aktif dengan variabel{" "}
              <span className="font-medium text-slate-900">jarak_meter</span>{" "}
              menuju {TARGET_DESTINATION}.
            </p>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-600">
            Unit observasi: kos-kosan
          </Badge>
        </div>
      </section>

      {error ? (
        <section className="col-span-12">
          <Alert variant="destructive">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Data statistik gagal dimuat</AlertTitle>
            <AlertDescription>
              {error}. Pastikan Supabase aktif dan user memiliki akses baca ke
              tabel kos_data.
            </AlertDescription>
          </Alert>
        </section>
      ) : null}

      {descriptiveStats.n === 0 ? (
        <section className="col-span-12">
          <EmptyStatisticsState />
        </section>
      ) : (
        <>
          <section className="col-span-12">
            <DataRequirementNotice n={descriptiveStats.n} />
          </section>

          <section className="col-span-12">
            <DescriptiveStatsCards stats={descriptiveStats} />
          </section>

          <section className="col-span-12">
            <StatisticsInterpretation stats={descriptiveStats} />
          </section>

          <section className="col-span-12">
            <OutlierPanel result={outlierResult} />
          </section>

          <section className="col-span-12">
            <ZScoreTable records={zScoreResult.records} />
          </section>
        </>
      )}
    </div>
  );
}

function EmptyStatisticsState() {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Belum ada data kos.</CardTitle>
        <CardDescription>
          Statistik deskriptif, z-score, dan analisis outlier akan muncul
          setelah raw data kos dimasukkan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
          <div className="max-w-md text-center">
            <Database
              className="mx-auto size-11 text-slate-400"
              aria-hidden="true"
            />
            <p className="mt-4 text-sm font-medium text-slate-900">
              Data aktif kosong
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Tambahkan data kos dengan jarak meter yang diukur manual dari
              Google Maps mode motor menuju titik acuan penelitian.
            </p>
            <Button asChild className="mt-5">
              <Link href="/input">
                <Plus className="size-4" aria-hidden="true" />
                Tambah Data Kos Pertama
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
