import { LoadingState } from "@/components/ui/loading-state";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function StatistikLoading() {
  return (
    <div className="grid grid-cols-12 gap-6" aria-busy="true">
      <section className="col-span-12">
        <LoadingState compact className="min-h-20" />
      </section>

      <section className="col-span-12">
        <SkeletonBlock className="h-12 w-full rounded-lg" />
      </section>

      <section className="col-span-12 grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="mt-4 h-8 w-28" />
            <SkeletonBlock className="mt-5 h-3 w-36" />
          </div>
        ))}
      </section>

      <section className="col-span-12 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <SkeletonBlock className="h-5 w-56" />
        <SkeletonBlock className="mt-3 h-3 w-96" />
        <TableSkeleton className="mt-5" columns={3} rows={8} />
      </section>

      <section className="col-span-12 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <SkeletonBlock className="h-5 w-44" />
        <SkeletonBlock className="mt-3 h-3 w-80" />
        <SkeletonBlock className="mt-5 h-20 w-full" />
      </section>
    </div>
  );
}

function SkeletonBlock({ className }: Readonly<{ className: string }>) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}
