import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MEASUREMENT_METHOD_LABEL,
  ROUTE_MODE_LABEL,
  TARGET_DESTINATION,
} from "@/lib/constants";

const methodologyItems = [
  ["Unit observasi", "Kos-kosan"],
  ["Variabel", "Jarak kos ke gerbang kampus"],
  ["Satuan", "Meter"],
  ["Mode rute", ROUTE_MODE_LABEL],
  ["Titik tujuan", TARGET_DESTINATION],
  ["Metode ukur", MEASUREMENT_METHOD_LABEL],
  ["Sampling", "Purposive convenience sampling"],
] as const;

export function MethodologyCard() {
  return (
    <Card className="h-full border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Metodologi Penelitian</CardTitle>
            <CardDescription>
              Acuan yang digunakan dalam pengumpulan data.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-slate-200 text-slate-600">
            Acuan tetap
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3">
          {methodologyItems.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[140px_1fr] gap-3 text-sm"
            >
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
