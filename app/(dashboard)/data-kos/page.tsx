import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function DataKosPage() {
  return (
    <PlaceholderPage
      title="Data Kos"
      description="Tabel data kos akan menampilkan raw data sebagai source of truth."
      items={[
        "Unit observasi: kos-kosan.",
        "Variabel utama: jarak kos ke gerbang kampus dalam meter.",
        "TanStack Table disiapkan untuk search, filter, sort, dan pagination.",
      ]}
    />
  );
}
