import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function InputDataPage() {
  return (
    <PlaceholderPage
      title="Input Data Kos"
      description="Form input kos akan memakai React Hook Form dan Zod setelah auth dan database aktif."
      items={[
        "Nama kos, area, jarak meter, Google Maps URL, dan catatan.",
        "Mode rute dikunci ke motor.",
        "Titik tujuan dikunci ke ATM BNI dekat gerbang FT Unsoed.",
      ]}
    />
  );
}
