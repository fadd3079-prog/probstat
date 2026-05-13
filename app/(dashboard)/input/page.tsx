import Link from "next/link";
import { ClipboardList, NotebookPen, ShieldAlert } from "lucide-react";

import { KosDataForm } from "@/components/kos/KosDataForm";
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
import { canCreateKosData, formatUserRoleLabel } from "@/lib/auth/roles";
import { getDashboardAuthState } from "@/lib/auth/session";
import {
  MEASUREMENT_METHOD_LABEL,
  ROUTE_MODE_LABEL,
  TARGET_DESTINATION,
} from "@/lib/constants";

export default async function InputDataPage() {
  const authState = await getDashboardAuthState();
  const profile =
    authState.status === "authenticated" ? authState.profile : null;
  const canCreate = canCreateKosData(profile?.role);

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Input Data Kos
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Tambah Data Kos
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Masukkan data jarak kos berdasarkan hasil pengukuran Google Maps
              dengan mode rute motor.
            </p>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-600">
            Akses: {formatUserRoleLabel(profile?.role)}
          </Badge>
        </div>
      </section>

      <section className="col-span-8">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Data Kos</CardTitle>
                <CardDescription>
                  Isi nama kos, area, jarak, dan tautan Google Maps jika
                  tersedia.
                </CardDescription>
              </div>
              <ClipboardList className="size-5 text-slate-500" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <KosDataForm
              disabledReason={
                canCreate
                  ? null
                  : "Akses Anda hanya untuk membaca data dan hasil analisis."
              }
            />
          </CardContent>
        </Card>
      </section>

      <section className="col-span-4 space-y-6">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Acuan Pengukuran</CardTitle>
            <CardDescription>
              Agar data konsisten, semua jarak menggunakan acuan yang sama.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <LockedMethodItem label="Mode rute" value={ROUTE_MODE_LABEL} />
              <LockedMethodItem label="Titik tujuan" value={TARGET_DESTINATION} />
              <LockedMethodItem
                label="Metode ukur"
                value={MEASUREMENT_METHOD_LABEL}
              />
            </dl>
          </CardContent>
        </Card>

        <Alert className="border-slate-200 bg-slate-50">
          <NotebookPen className="size-4 text-slate-600" aria-hidden="true" />
          <AlertTitle>Cek data sebelum disimpan</AlertTitle>
          <AlertDescription>
            Pastikan jarak diambil dari Google Maps dengan titik tujuan yang
            sama. Cek kembali titik awal dan titik tujuan sebelum menyimpan
            data.
          </AlertDescription>
        </Alert>

        {!canCreate ? (
          <Alert className="border-amber-200 bg-amber-50">
            <ShieldAlert className="size-4 text-amber-700" aria-hidden="true" />
            <AlertTitle>Akses hanya baca</AlertTitle>
            <AlertDescription>
              Akun ini dapat melihat data dan hasil analisis, tetapi tidak
              dapat menambah atau mengubah data kos.
            </AlertDescription>
          </Alert>
        ) : null}

        <Button asChild variant="outline" className="w-full">
          <Link href="/data-kos">Lihat Data Kos</Link>
        </Button>
      </section>
    </div>
  );
}

function LockedMethodItem({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-900">{value}</dd>
    </div>
  );
}
