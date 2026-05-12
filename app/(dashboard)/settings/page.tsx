import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Settings metodologi, interval, dan export akan dikelola admin."
      items={[
        "Mode rute default motor dan terkunci.",
        "Titik tujuan default ATM BNI dekat gerbang FT Unsoed.",
        "Pengaturan final harus tercatat di audit log.",
      ]}
    />
  );
}
