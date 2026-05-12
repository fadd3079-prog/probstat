import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function AuditLogPage() {
  return (
    <PlaceholderPage
      title="Audit Log"
      description="Audit log akan mencatat perubahan data penting setelah Supabase dan RLS tersedia."
      items={[
        "Create, update, delete, restore, import, export, settings, dan freeze.",
        "Admin membaca semua log; member membaca log miliknya sendiri.",
        "Viewer tidak memerlukan akses audit log.",
      ]}
    />
  );
}
