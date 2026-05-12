import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { KosDataDbRow, KosDataRecord } from "@/types/kos";
import type { DistanceObservation } from "@/types/statistics";

export type FetchActiveKosDataResult = Readonly<{
  data: readonly KosDataRecord[];
  error: string | null;
}>;

const KOS_DATA_SELECT = `
  id,
  nama_kos,
  area,
  jarak_meter,
  google_maps_url,
  mode_rute,
  titik_tujuan,
  metode_pengukuran,
  catatan,
  data_quality_status,
  created_by,
  updated_by,
  is_deleted,
  deleted_at,
  deleted_by,
  created_at,
  updated_at
`;

export async function fetchActiveKosData(): Promise<FetchActiveKosDataResult> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      data: [],
      error: "Supabase belum dikonfigurasi.",
    };
  }

  const { data, error } = await supabase
    .from("kos_data")
    .select(KOS_DATA_SELECT)
    .eq("is_deleted", false)
    .order("jarak_meter", { ascending: true })
    .order("nama_kos", { ascending: true });

  if (error) {
    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []).map(mapKosDataRow),
    error: null,
  };
}

export function mapKosDataRow(row: KosDataDbRow): KosDataRecord {
  return {
    id: row.id,
    namaKos: row.nama_kos,
    area: row.area,
    jarakMeter: row.jarak_meter,
    googleMapsUrl: row.google_maps_url,
    modeRute: row.mode_rute,
    titikTujuan: row.titik_tujuan,
    metodePengukuran: row.metode_pengukuran,
    catatan: row.catatan,
    dataQualityStatus: row.data_quality_status,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    isDeleted: row.is_deleted,
    deletedAt: row.deleted_at,
    deletedBy: row.deleted_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toDistanceObservationsFromKosData(
  records: readonly KosDataRecord[],
): DistanceObservation[] {
  return records.map((record) => ({
    id: record.id,
    name: record.namaKos,
    distance: record.jarakMeter,
  }));
}
