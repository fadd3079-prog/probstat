import { CalendarDays, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RESEARCH_TITLE } from "@/lib/constants";

export function DashboardTopbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      <div>
        <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
          Project
        </p>
        <p className="text-sm font-semibold text-slate-950">{RESEARCH_TITLE}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="gap-1 border-slate-200 text-slate-600">
          <CalendarDays className="size-3" aria-hidden="true" />
          Milestone 1
        </Badge>
        <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700">
          <ShieldCheck className="size-3" aria-hidden="true" />
          RLS planned
        </Badge>
      </div>
    </header>
  );
}
