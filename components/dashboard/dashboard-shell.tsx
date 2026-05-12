import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import type { UserProfile } from "@/types/users";

type DashboardShellProps = Readonly<{
  children: ReactNode;
  profile: UserProfile;
  email: string | null;
}>;

export function DashboardShell({ children, email, profile }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar role={profile.role} />
      <div className="ml-72 flex min-h-screen flex-col">
        <DashboardTopbar email={email} profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
