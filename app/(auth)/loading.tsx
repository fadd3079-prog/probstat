import { LoadingState } from "@/components/ui/loading-state";

export default function AuthLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-8">
      <LoadingState
        className="w-full max-w-md"
        description="Mohon tunggu sebentar..."
        title="Memuat data..."
      />
    </main>
  );
}
