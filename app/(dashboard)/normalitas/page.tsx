import Link from "next/link";
import { Database, Plus, ShieldAlert } from "lucide-react";

import { NormalityDashboard } from "@/components/normality/NormalityDashboard";
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
import { TARGET_DESTINATION } from "@/lib/constants";
import {
  fetchActiveKosDistanceData,
  toDistanceObservationsFromKosData,
} from "@/lib/kos/fetch-kos-data";
import {
  generateQqPlotData,
  performLillieforsNormalityTest,
} from "@/lib/statistics";

export default async function NormalitasPage() {
  const { data: kosData, error } = await fetchActiveKosDistanceData();
  const observations = toDistanceObservationsFromKosData(kosData);
  const normality = performLillieforsNormalityTest(observations);
  const qqPlot = generateQqPlotData(observations);

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Uji Normalitas
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Uji Normalitas
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Pengujian Liliefors-style untuk melihat apakah data jarak kos
              menuju {TARGET_DESTINATION} mengikuti pola distribusi normal.
            </p>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-600">
            Alpha 0,05
          </Badge>
        </div>
      </section>

      {error ? (
        <section className="col-span-12">
          <Alert variant="destructive">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Uji normalitas gagal dimuat</AlertTitle>
            <AlertDescription>
              Data belum dapat dimuat. Coba muat ulang halaman atau hubungi
              admin jika masalah berlanjut.
            </AlertDescription>
          </Alert>
        </section>
      ) : null}

      {!error && normality.n === 0 ? (
        <section className="col-span-12">
          <EmptyNormalityState />
        </section>
      ) : null}

      {!error && normality.n > 0 ? (
        <NormalityDashboard normality={normality} qqPlot={qqPlot} />
      ) : null}
    </div>
  );
}

function EmptyNormalityState() {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Belum ada data kos.</CardTitle>
        <CardDescription>
          Uji normalitas, tabel Zi, dan QQ Plot akan muncul setelah data kos
          aktif tersedia.
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
              Tambahkan sampel kos terlebih dahulu. Uji normalitas membaca
              variabel jarak meter dari data mentah yang tidak dihapus.
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
