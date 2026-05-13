"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Database,
  FileDown,
  Gauge,
  History,
  LineChart,
  LogOut,
  Settings,
  Sigma,
  TableProperties,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatUserRoleLabel } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/users";

type NavigationItem = Readonly<{
  label: string;
  href: string;
  icon: LucideIcon;
}>;

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Input Data", href: "/input", icon: ClipboardList },
  { label: "Data Kos", href: "/data-kos", icon: TableProperties },
  { label: "Statistik", href: "/statistik", icon: Sigma },
  { label: "Distribusi", href: "/distribusi", icon: BarChart3 },
  { label: "Uji Normalitas", href: "/normalitas", icon: LineChart },
  { label: "Visualisasi", href: "/visualisasi", icon: Database },
  { label: "Ekspor", href: "/export", icon: FileDown },
  { label: "Log Aktivitas", href: "/audit-log", icon: History },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

export function DashboardSidebar({ role }: Readonly<{ role: UserRole }>) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-slate-200 bg-white">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Gauge className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-5 text-slate-950">
              Dashboard Jarak Kos
            </p>
            <p className="text-xs text-slate-500">FT Unsoed</p>
          </div>
        </div>
        <div className="mt-4">
          <Badge variant="outline" className="border-slate-200 text-slate-600">
            Akses: {formatUserRoleLabel(role)}
          </Badge>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Utama">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-400">
          <LogOut className="size-4" aria-hidden="true" />
          <span>Keluar tersedia di bagian atas</span>
        </div>
      </div>
    </aside>
  );
}
