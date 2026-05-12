import Link from "next/link";
import { ClipboardList, Database, ShieldAlert } from "lucide-react";

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
import { canCreateKosData } from "@/lib/auth/roles";
import { getDashboardAuthState } from "@/lib/auth/session";
import { MEASUREMENT_METHOD, ROUTE_MODE, TARGET_DESTINATION } from "@/lib/constants";

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
              Tambah Data Jarak Kos
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Data real harus dimasukkan melalui dashboard produksi setelah
              login. Form ini menyimpan langsung ke Supabase menggunakan sesi
              user yang aktif dan tetap dilindungi RLS.
            </p>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-600">
            Role: {profile?.role ?? "unknown"}
          </Badge>
        </div>
      </section>

      <section className="col-span-8">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Form Kos</CardTitle>
                <CardDescription>
                  Unit observasi adalah kos-kosan. Jarak diinput manual dari
                  Google Maps, bukan dihitung otomatis dari API.
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
                  : "Viewer hanya dapat membaca dashboard dan tidak memiliki akses membuat data kos."
              }
            />
          </CardContent>
        </Card>
      </section>

      <section className="col-span-4 space-y-6">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Metodologi Tetap</CardTitle>
            <CardDescription>
              Field berikut dikunci agar data konsisten secara akademik.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <LockedMethodItem label="Mode rute" value={ROUTE_MODE} />
              <LockedMethodItem label="Titik tujuan" value={TARGET_DESTINATION} />
              <LockedMethodItem label="Metode ukur" value={MEASUREMENT_METHOD} />
            </dl>
          </CardContent>
        </Card>

        <Alert className="border-slate-200 bg-slate-50">
          <Database className="size-4 text-slate-600" aria-hidden="true" />
          <AlertTitle>Produksi sebagai sumber data real</AlertTitle>
          <AlertDescription>
            Setelah deploy Vercel, gunakan URL produksi untuk input, edit, dan
            soft delete data real. Localhost hanya untuk pengembangan dan QA.
          </AlertDescription>
        </Alert>

        {!canCreate ? (
          <Alert className="border-amber-200 bg-amber-50">
            <ShieldAlert className="size-4 text-amber-700" aria-hidden="true" />
            <AlertTitle>Viewer tidak dapat input</AlertTitle>
            <AlertDescription>
              Role viewer tetap dapat melihat data dan statistik, tetapi tidak
              dapat membuat atau mengubah data kos.
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
