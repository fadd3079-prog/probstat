import { LoadingState } from "@/components/ui/loading-state";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function DataKosLoading() {
  return (
    <div className="grid grid-cols-12 gap-6" aria-busy="true">
      <section className="col-span-12">
        <LoadingState compact className="min-h-20" />
      </section>

      <section className="col-span-12 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="mt-3 h-3 w-72" />
          </div>
          <SkeletonBlock className="h-8 w-28" />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <SkeletonBlock className="h-8 w-96" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
        <TableSkeleton className="mt-4" columns={7} rows={8} />
      </section>
    </div>
  );
}

function SkeletonBlock({ className }: Readonly<{ className: string }>) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}
