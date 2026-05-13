import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Pengaturan Penelitian"
      description="Atur informasi dasar yang digunakan dalam pengumpulan dan analisis data."
      items={[
        "Mode rute default motor dan terkunci.",
        "Titik tujuan default ATM BNI dekat gerbang FT Unsoed.",
        "Perubahan pengaturan penting perlu dicatat dalam riwayat aktivitas.",
      ]}
    />
  );
}
