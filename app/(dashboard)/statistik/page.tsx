import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function StatistikPage() {
  return (
    <PlaceholderPage
      title="Statistik Deskriptif"
      description="Statistik turunan akan dihitung dari data mentah, bukan disimpan permanen."
      items={[
        "Mean, median, modus, range, varians, dan standar deviasi.",
        "Z-score normalization dan outlier detection.",
        "Rumus statistik wajib memiliki unit test.",
      ]}
    />
  );
}
