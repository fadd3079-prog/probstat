import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

type DashboardShellProps = Readonly<{
  children: ReactNode;
}>;

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="ml-72 flex min-h-screen flex-col">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
