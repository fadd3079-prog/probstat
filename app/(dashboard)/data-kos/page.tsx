import Link from "next/link";
import { Database, Plus, ShieldAlert } from "lucide-react";

import { DataKosTable } from "@/components/kos/DataKosTable";
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
import { canCreateKosData } from "@/lib/auth/roles";
import { getDashboardAuthState } from "@/lib/auth/session";
import { fetchActiveKosData } from "@/lib/kos/fetch-kos-data";

export default async function DataKosPage() {
  const [authState, kosResult] = await Promise.all([
    getDashboardAuthState(),
    fetchActiveKosData(),
  ]);
  const profile =
    authState.status === "authenticated" ? authState.profile : null;

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">Data Kos</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Raw Data Jarak Kos
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Tabel ini menampilkan data kos aktif sebagai sumber utama
              dashboard, statistik, dan audit. Normal data entry dilakukan dari
              web UI setelah deploy, bukan dari SQL editor.
            </p>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-600">
            {kosResult.data.length} data aktif
          </Badge>
        </div>
      </section>

      {kosResult.error ? (
        <section className="col-span-12">
          <Alert variant="destructive">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Data kos gagal dimuat</AlertTitle>
            <AlertDescription>
              {kosResult.error}. Pastikan environment Supabase di Vercel sudah
              benar dan user memiliki akses sesuai RLS.
            </AlertDescription>
          </Alert>
        </section>
      ) : null}

      <section className="col-span-12">
        {profile && kosResult.data.length > 0 ? (
          <DataKosTable profile={profile} records={kosResult.data} />
        ) : (
          <EmptyDataKosState canCreate={canCreateKosData(profile?.role)} />
        )}
      </section>
    </div>
  );
}

function EmptyDataKosState({
  canCreate,
}: Readonly<{
  canCreate: boolean;
}>) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Belum ada data kos.</CardTitle>
        <CardDescription>
          Data yang dibuat dari halaman Input Data akan muncul di tabel ini dan
          langsung memengaruhi KPI dashboard.
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
              Raw data masih kosong
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Gunakan dashboard produksi Vercel untuk memasukkan data kos real
              agar audit log dan session user tercatat konsisten.
            </p>
            {canCreate ? (
              <Button asChild className="mt-5">
                <Link href="/input">
                  <Plus className="size-4" aria-hidden="true" />
                  Tambah Data Kos Pertama
                </Link>
              </Button>
            ) : (
              <p className="mt-5 text-sm font-medium text-amber-700">
                Role viewer tidak dapat membuat data kos.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
