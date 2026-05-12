import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function ProtectedDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Milestone 2: verify Supabase session and role before rendering this shell.
  return <DashboardShell>{children}</DashboardShell>;
}
