import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function NormalitasPage() {
  return (
    <PlaceholderPage
      title="Uji Normalitas"
      description="Pemeriksaan apakah data jarak kos mengikuti pola distribusi normal."
      items={[
        "Hipotesis H0 dan H1 menggunakan taraf signifikansi 0,05.",
        "Tabel uji memuat Zi, F(zi), S(zi), dan selisih absolut.",
        "Data yang tidak berdistribusi normal bukan berarti penelitian gagal. Hasil tersebut hanya menunjukkan bahwa sebaran data tidak mengikuti pola normal.",
      ]}
    />
  );
}
