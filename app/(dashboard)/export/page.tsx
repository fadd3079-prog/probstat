import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function ExportPage() {
  return (
    <PlaceholderPage
      title="Export dan Laporan"
      description="Export data dan laporan akan memakai library yang diload dinamis agar bundle awal tetap ringan."
      items={[
        "CSV, XLSX, JSON untuk data mentah.",
        "PDF, DOCX, HTML untuk laporan lengkap.",
        "Report preview harus tersedia sebelum export final.",
      ]}
    />
  );
}
