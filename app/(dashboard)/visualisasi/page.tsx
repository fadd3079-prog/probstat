import Link from "next/link";
import { Database, Plus, ShieldAlert } from "lucide-react";

import { VisualizationDashboard } from "@/components/visualization/VisualizationDashboard";
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
  MEASUREMENT_METHOD_LABEL,
  ROUTE_MODE_LABEL,
  TARGET_DESTINATION,
} from "@/lib/constants";
import {
  fetchActiveKosDistanceData,
  toDistanceObservationsFromKosData,
} from "@/lib/kos/fetch-kos-data";
import { calculateDescriptiveStatistics } from "@/lib/statistics";

export default async function VisualisasiPage() {
  const { data: kosData, error } = await fetchActiveKosDistanceData();
  const observations = toDistanceObservationsFromKosData(kosData);
  const stats = calculateDescriptiveStatistics(observations);

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Visualisasi Data
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Visualisasi Data
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Grafik pendukung untuk membaca pola sebaran jarak kos menuju{" "}
              {TARGET_DESTINATION}. Visualisasi tetap berbasis data mentah kos
              aktif.
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
            <AlertTitle>Visualisasi gagal dimuat</AlertTitle>
            <AlertDescription>
              Data belum dapat dimuat. Coba muat ulang halaman atau hubungi
              admin jika masalah berlanjut.
            </AlertDescription>
          </Alert>
        </section>
      ) : null}

      {!error && stats.n === 0 ? (
        <section className="col-span-12">
          <EmptyVisualizationState />
        </section>
      ) : null}

      {!error && stats.n > 0 ? (
        <>
          <section className="col-span-12">
            <VisualizationMethodologyCard />
          </section>
          <VisualizationDashboard observations={observations} stats={stats} />
        </>
      ) : null}
    </div>
  );
}

function EmptyVisualizationState() {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Belum ada data kos.</CardTitle>
        <CardDescription>
          Histogram, donut chart, boxplot, scatter plot, dan QQ Plot akan
          muncul setelah data kos aktif tersedia.
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
              Tambahkan data kos dengan jarak meter agar grafik dapat dibentuk
              dari sampel yang sama dengan analisis statistik.
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

function VisualizationMethodologyCard() {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Acuan Visualisasi</CardTitle>
        <CardDescription>
          Semua grafik menggunakan variabel jarak meter dari data kos aktif.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <MethodologyItem label="Mode rute" value={ROUTE_MODE_LABEL} />
          <MethodologyItem label="Titik tujuan" value={TARGET_DESTINATION} />
          <MethodologyItem
            label="Metode ukur"
            value={MEASUREMENT_METHOD_LABEL}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MethodologyItem({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
