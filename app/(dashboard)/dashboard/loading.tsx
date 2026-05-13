import { LoadingState } from "@/components/ui/loading-state";

export default function DashboardLoading() {
  return (
    <div className="grid grid-cols-12 gap-6" aria-busy="true">
      <section className="col-span-12">
        <LoadingState compact className="min-h-20" />
      </section>

      {Array.from({ length: 4 }, (_, index) => (
        <section
          key={index}
          className="col-span-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="mt-4 h-8 w-28" />
          <SkeletonBlock className="mt-5 h-3 w-36" />
        </section>
      ))}

      <section className="col-span-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="mt-3 h-3 w-64" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBlock key={index} className="h-12 w-full" />
          ))}
        </div>
      </section>

      <section className="col-span-7 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <SkeletonBlock className="h-5 w-48" />
        <SkeletonBlock className="mt-3 h-3 w-80" />
        <div className="mt-8 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBlock key={index} className="h-24 w-full" />
          ))}
        </div>
        <SkeletonBlock className="mt-6 h-16 w-full" />
      </section>
    </div>
  );
}

function SkeletonBlock({ className }: Readonly<{ className: string }>) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}
