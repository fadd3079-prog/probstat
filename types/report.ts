export type ExportFormat = "csv" | "xlsx" | "pdf" | "docx" | "html" | "json";

export type ReportSectionKey =
  | "cover"
  | "pendahuluan"
  | "rumusan_masalah"
  | "tujuan"
  | "metode"
  | "data_mentah"
  | "distribusi_frekuensi"
  | "statistik_deskriptif"
  | "normalisasi_z_score"
  | "uji_normalitas"
  | "visualisasi"
  | "pembahasan"
  | "kesimpulan"
  | "lampiran";

export type ReportMetadata = Readonly<{
  title: string;
  courseName: string | null;
  lecturerName: string | null;
  groupName: string | null;
  members: readonly string[];
  academicYear: string | null;
  generatedAt: string;
}>;

export type ReportSection = Readonly<{
  key: ReportSectionKey;
  title: string;
  content: string;
  editable: boolean;
}>;

export type GeneratedReport = Readonly<{
  metadata: ReportMetadata;
  sections: readonly ReportSection[];
  availableFormats: readonly ExportFormat[];
}>;
