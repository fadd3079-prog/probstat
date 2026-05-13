import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function ExportPage() {
  return (
    <PlaceholderPage
      title="Ekspor Data dan Laporan"
      description="Unduh data atau laporan hasil analisis dalam format yang dibutuhkan."
      items={[
        "CSV, XLSX, JSON untuk data mentah.",
        "PDF, DOCX, HTML untuk laporan lengkap.",
        "Pratinjau laporan harus tersedia sebelum ekspor akhir.",
      ]}
    />
  );
}
