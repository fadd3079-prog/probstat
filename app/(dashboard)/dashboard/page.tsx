import { AlertTriangle, CheckCircle2, MapPinned, Ruler } from "lucide-react";
import { MethodologyCard } from "@/components/dashboard/methodology-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MIN_SAMPLE_SIZE } from "@/lib/constants";

const kpiItems = [
  {
    label: "Total Kos",
    value: "0",
    helper: `Target minimal ${MIN_SAMPLE_SIZE} kos`,
    icon: MapPinned,
  },
  {
    label: "Data Valid",
    value: "0",
    helper: "Belum ada observasi",
    icon: CheckCircle2,
  },
  {
    label: "Perlu Review",
    value: "0",
    helper: "Tidak ada warning",
    icon: AlertTriangle,
  },
  {
    label: "Rata-rata Jarak",
    value: "-",
    helper: "Meter",
    icon: Ruler,
  },
];

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Dashboard Analisis Jarak Kos FT Unsoed
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Jarak Kos-kosan Mahasiswa di Sekitar FT Unsoed ke Gerbang Kampus
            </h1>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-600">
            Dataset belum final
          </Badge>
        </div>
      </section>

      {kpiItems.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}

      <section className="col-span-5">
        <MethodologyCard />
      </section>

      <section className="col-span-7">
        <Card className="h-full border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Belum ada data kos</CardTitle>
            <CardDescription>
              Unit observasi adalah kos-kosan. Statistik akan dihitung dari data
              mentah jarak kos dalam meter.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
              <div className="max-w-sm text-center">
                <MapPinned
                  className="mx-auto size-10 text-slate-400"
                  aria-hidden="true"
                />
                <p className="mt-3 text-sm font-medium text-slate-800">
                  Data input akan muncul di sini setelah Milestone 3.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Dashboard foundation sudah siap untuk tabel, statistik, dan
                  visualisasi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
