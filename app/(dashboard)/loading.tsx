import { LoadingState } from "@/components/ui/loading-state";

export default function DashboardGroupLoading() {
  return (
    <LoadingState
      className="min-h-[calc(100vh-12rem)]"
      description="Mohon tunggu sebentar..."
      title="Memuat data..."
    />
  );
}
