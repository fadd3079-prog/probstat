import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function DistribusiPage() {
  return (
    <PlaceholderPage
      title="Distribusi Frekuensi"
      description="Distribusi frekuensi akan mendukung interval manual dan Sturges."
      items={[
        "Tabel interval, frekuensi, persentase, dan frekuensi kumulatif.",
        "Histogram dan bar chart harus konsisten dengan tabel distribusi.",
        "Interpretasi tetap membahas kos, bukan jumlah mahasiswa.",
      ]}
    />
  );
}
