import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function VisualisasiPage() {
  return (
    <PlaceholderPage
      title="Visualisasi"
      description="Visualisasi Recharts akan dibangun setelah data dan statistik tersedia."
      items={[
        "Histogram, bar chart, donut chart, boxplot, scatter plot, dan QQ Plot.",
        "Line chart hanya untuk aktivitas input per hari jika diperlukan.",
        "Visualisasi harus membantu interpretasi akademik.",
      ]}
    />
  );
}
