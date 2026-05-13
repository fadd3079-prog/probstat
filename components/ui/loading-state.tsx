import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

type LoadingStateProps = Readonly<{
  className?: string;
  compact?: boolean;
  description?: string;
  title?: string;
}>;

export function LoadingState({
  className,
  compact = false,
  description = "Mohon tunggu sebentar...",
  title = "Memuat data...",
}: LoadingStateProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "grid min-h-72 place-items-center rounded-lg border border-slate-200 bg-white p-6 shadow-sm",
        compact && "min-h-24 rounded-lg p-4 shadow-none",
        className,
      )}
    >
      <div className="flex items-center gap-3 text-slate-700">
        <LoadingSpinner className="size-5 text-slate-700" label={title} />
        <div>
          <p className="text-sm font-medium text-slate-900">{title}</p>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
