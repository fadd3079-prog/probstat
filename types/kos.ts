export type RouteMode = "motor";

export type MeasurementMethod = "Google Maps mode motor";

export type DataQualityStatus =
  | "valid"
  | "warning"
  | "needs_review"
  | "duplicate_suspected";

export type KosDataRecord = Readonly<{
  id: string;
  namaKos: string;
  area: string | null;
  jarakMeter: number;
  googleMapsUrl: string | null;
  modeRute: RouteMode;
  titikTujuan: string;
  metodePengukuran: MeasurementMethod;
  catatan: string | null;
  dataQualityStatus: DataQualityStatus;
  createdBy: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export type KosDataInput = Readonly<{
  namaKos: string;
  area: string;
  jarakMeter: number;
  googleMapsUrl: string;
  catatan?: string;
}>;

export type KosDataDbRow = Readonly<{
  id: string;
  nama_kos: string;
  area: string | null;
  jarak_meter: number;
  google_maps_url: string | null;
  mode_rute: RouteMode;
  titik_tujuan: string;
  metode_pengukuran: MeasurementMethod;
  catatan: string | null;
  data_quality_status: DataQualityStatus;
  created_by: string | null;
  updated_by: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
}>;
