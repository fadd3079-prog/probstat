import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Plus,
  ShieldAlert,
} from "lucide-react";

import { DistributionDashboard } from "@/components/distribution/DistributionDashboard";
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
  MIN_SAMPLE_SIZE,
  ROUTE_MODE_LABEL,
  TARGET_DESTINATION,
} from "@/lib/constants";
import {
  fetchActiveKosDistanceData,
  toDistanceObservationsFromKosData,
} from "@/lib/kos/fetch-kos-data";
import { calculateDescriptiveStatistics } from "@/lib/statistics";

export default async function DistribusiPage() {
  const { data: kosData, error } = await fetchActiveKosDistanceData();
  const observations = toDistanceObservationsFromKosData(kosData);
  const stats = calculateDescriptiveStatistics(observations);

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Distribusi Frekuensi
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Distribusi Frekuensi
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Pengelompokan data jarak kos berdasarkan interval tertentu.
              Distribusi ini membantu melihat rentang jarak yang paling banyak
              muncul dalam data.
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
            <AlertTitle>Distribusi frekuensi gagal dimuat</AlertTitle>
            <AlertDescription>
              Data belum dapat dimuat. Coba muat ulang halaman atau hubungi
              admin jika masalah berlanjut.
            </AlertDescription>
          </Alert>
        </section>
      ) : null}

      {!error && stats.n === 0 ? (
        <section className="col-span-12">
          <EmptyDistributionState />
        </section>
      ) : null}

      {!error && stats.n > 0 ? (
        <>
          <section className="col-span-12">
            {stats.n < MIN_SAMPLE_SIZE ? (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle
                  className="size-4 text-amber-700"
                  aria-hidden="true"
                />
                <AlertTitle>Distribusi masih sementara</AlertTitle>
                <AlertDescription>
                  Jumlah data masih kurang dari target minimal 30 kos, sehingga
                  distribusi frekuensi masih bersifat sementara.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className="size-5 text-emerald-700"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-emerald-900">
                      Target data awal terpenuhi
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      Distribusi frekuensi dapat dibaca sebagai ringkasan
                      sampel kos aktif.
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-300 bg-white text-emerald-700"
                >
                  Jumlah data sudah memenuhi target awal 30 kos.
                </Badge>
              </div>
            )}
          </section>

          <section className="col-span-12">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Acuan Pengukuran</CardTitle>
                <CardDescription>
                  Semua interval dihitung dari data kos aktif dengan acuan
                  pengukuran yang sama.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <MethodologyItem label="Mode rute" value={ROUTE_MODE_LABEL} />
                  <MethodologyItem
                    label="Titik tujuan"
                    value={TARGET_DESTINATION}
                  />
                  <MethodologyItem
                    label="Metode ukur"
                    value={MEASUREMENT_METHOD_LABEL}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <DistributionDashboard observations={observations} stats={stats} />
        </>
      ) : null}
    </div>
  );
}

function EmptyDistributionState() {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Belum ada data kos.</CardTitle>
        <CardDescription>
          Tambahkan data terlebih dahulu sebelum membuat distribusi frekuensi.
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
              Belum ada data kos. Tambahkan data terlebih dahulu sebelum
              membuat distribusi frekuensi.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Setelah data kos aktif tersedia, sistem akan membuat interval
              manual dan interval Sturges secara otomatis.
            </p>
            <Button asChild className="mt-5">
              <Link href="/input">
                <Plus className="size-4" aria-hidden="true" />
                Tambah Data Kos
              </Link>
            </Button>
          </div>
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
