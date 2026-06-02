import { ShieldAlert } from "lucide-react";

import { ExportDashboard } from "@/components/export/ExportDashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { fetchActiveKosData } from "@/lib/kos/fetch-kos-data";
import { generateReportData } from "@/lib/report/generate-report-data";
import { createClient } from "@/lib/supabase/server";
import { TARGET_DESTINATION } from "@/lib/constants";
import type { KosDataRecord } from "@/types/kos";

export default async function ExportPage() {
  const { data: kosData, error } = await fetchActiveKosData();
  const profileNameById = error
    ? new Map<string, string>()
    : await fetchProfileNameById(kosData);
  const reportData = generateReportData(kosData, { profileNameById });

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Ekspor Data dan Laporan
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Ekspor Data dan Laporan
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Unduh data atau laporan hasil analisis dalam format yang
              dibutuhkan.
            </p>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-600">
            Tujuan: {TARGET_DESTINATION}
          </Badge>
        </div>
      </section>

      {error ? (
        <section className="col-span-12">
          <Alert variant="destructive">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Data ekspor gagal dimuat</AlertTitle>
            <AlertDescription>
              Data belum dapat dimuat. Coba muat ulang halaman atau hubungi
              admin jika masalah berlanjut.
            </AlertDescription>
          </Alert>
        </section>
      ) : (
        <section className="col-span-12">
          <ExportDashboard reportData={reportData} />
        </section>
      )}
    </div>
  );
}

async function fetchProfileNameById(
  records: readonly KosDataRecord[],
): Promise<Map<string, string>> {
  const profileIds = [
    ...new Set(
      records
        .map((record) => record.createdBy)
        .filter((createdBy): createdBy is string => Boolean(createdBy)),
    ),
  ];

  if (profileIds.length === 0) {
    return new Map();
  }

  const supabase = await createClient();

  if (!supabase) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", profileIds);

  if (error) {
    return new Map();
  }

  return new Map((data ?? []).map((profile) => [profile.id, profile.full_name]));
}
