import { CalendarDays, LogOut, ShieldCheck } from "lucide-react";
import { logout } from "@/app/(dashboard)/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RESEARCH_TITLE } from "@/lib/constants";
import type { UserProfile } from "@/types/users";

export function DashboardTopbar({
  email,
  profile,
}: Readonly<{
  email: string | null;
  profile: UserProfile;
}>) {
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
          Milestone 2
        </Badge>
        <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700">
          <ShieldCheck className="size-3" aria-hidden="true" />
          RLS active
        </Badge>
        <div className="border-l border-slate-200 pl-3 text-right">
          <p className="text-sm font-medium text-slate-950">
            {profile.fullName}
          </p>
          <p className="text-xs text-slate-500">{email ?? profile.role}</p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="outline" className="gap-2">
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
}
