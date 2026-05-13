import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function VisualisasiPage() {
  return (
    <PlaceholderPage
      title="Visualisasi Data"
      description="Tampilan grafik untuk membantu membaca pola sebaran jarak kos."
      items={[
        "Grafik digunakan sebagai pendukung analisis, bukan pengganti perhitungan statistik.",
        "Histogram, diagram batang, diagram persentase, boxplot, scatter plot, dan QQ Plot.",
        "Setiap grafik harus tetap menjelaskan sebaran kos, bukan sebaran tempat tinggal mahasiswa.",
      ]}
    />
  );
}
