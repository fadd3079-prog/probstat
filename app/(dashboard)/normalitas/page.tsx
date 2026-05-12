import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function NormalitasPage() {
  return (
    <PlaceholderPage
      title="Uji Normalitas"
      description="Uji normalitas Liliefors-style dan QQ Plot akan dibangun setelah engine statistik stabil."
      items={[
        "Hipotesis H0 dan H1 memakai taraf signifikansi 0,05.",
        "Detail tabel mencakup Zi, F(zi), S(zi), dan selisih absolut.",
        "Data tidak normal bukan kegagalan penelitian.",
      ]}
    />
  );
}
