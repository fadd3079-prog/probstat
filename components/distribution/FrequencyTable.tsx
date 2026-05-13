import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatFrequencyBound,
  formatFrequencyIntervalLabel,
  formatFrequencyMidpoint,
  formatFrequencyPercentage,
  formatRelativeFrequency,
} from "@/lib/format/frequency";
import { formatNumber } from "@/lib/format/statistics";
import type { FrequencyDistribution } from "@/types/frequency";

type FrequencyTableProps = Readonly<{
  distribution: FrequencyDistribution;
}>;

export function FrequencyTable({ distribution }: FrequencyTableProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Tabel Distribusi Frekuensi</CardTitle>
            <CardDescription>
              Frekuensi dihitung dari data kos aktif berdasarkan jarak dalam
              meter.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-slate-200 text-slate-600">
            {distribution.mode === "manual" ? "Manual" : "Sturges"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 text-right">No</TableHead>
              <TableHead>Interval Jarak</TableHead>
              <TableHead className="text-right">Batas Bawah</TableHead>
              <TableHead className="text-right">Batas Atas</TableHead>
              <TableHead className="text-right">Titik Tengah</TableHead>
              <TableHead className="text-right">Frekuensi</TableHead>
              <TableHead className="text-right">Frekuensi Relatif</TableHead>
              <TableHead className="text-right">Persentase</TableHead>
              <TableHead className="text-right">Frekuensi Kumulatif</TableHead>
              <TableHead className="text-right">Persentase Kumulatif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {distribution.classes.map((frequencyClass, index) => (
              <TableRow key={frequencyClass.id}>
                <TableCell className="text-right font-mono text-slate-500">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    {formatFrequencyIntervalLabel(frequencyClass)}
                    {frequencyClass.isModalClass ? (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 text-emerald-700"
                      >
                        Terbanyak
                      </Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatFrequencyBound(frequencyClass.lowerBound)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatFrequencyBound(frequencyClass.upperBound)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatFrequencyMidpoint(frequencyClass.midpoint)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatNumber(frequencyClass.frequency, 0)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatRelativeFrequency(frequencyClass.relativeFrequency)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatFrequencyPercentage(frequencyClass.percentage)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatNumber(frequencyClass.cumulativeFrequency, 0)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatFrequencyPercentage(
                    frequencyClass.cumulativePercentage,
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
