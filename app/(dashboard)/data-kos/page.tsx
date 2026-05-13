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
              Data Kos
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Daftar kos yang sudah masuk ke dalam dataset penelitian.
            </p>
          </div>
          {!kosResult.error ? (
            <Badge variant="outline" className="border-slate-300 text-slate-600">
              {kosResult.data.length} data aktif
            </Badge>
          ) : null}
        </div>
      </section>

      {kosResult.error ? (
        <section className="col-span-12">
          <Alert variant="destructive">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Data kos belum dapat dimuat</AlertTitle>
            <AlertDescription>
              Coba muat ulang halaman atau hubungi admin jika masalah
              berlanjut.
            </AlertDescription>
          </Alert>
        </section>
      ) : null}

      <section className="col-span-12">
        {!kosResult.error ? (
          profile && kosResult.data.length > 0 ? (
            <DataKosTable profile={profile} records={kosResult.data} />
          ) : (
            <EmptyDataKosState canCreate={canCreateKosData(profile?.role)} />
          )
        ) : null}
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
          Belum ada data kos. Tambahkan data terlebih dahulu melalui halaman
          Input Data.
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
              Belum ada data kos.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Tambahkan data terlebih dahulu melalui halaman Input Data.
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
                Akses ini tidak dapat menambahkan data kos.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
