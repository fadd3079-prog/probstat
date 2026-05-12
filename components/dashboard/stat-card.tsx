import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatCardProps = Readonly<{
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
}>;

export function StatCard({ label, value, helper, icon: Icon }: StatCardProps) {
  return (
    <Card className="col-span-3 border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardDescription>{label}</CardDescription>
          <CardTitle className="mt-2 text-2xl">{value}</CardTitle>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500">{helper}</p>
      </CardContent>
    </Card>
  );
}
