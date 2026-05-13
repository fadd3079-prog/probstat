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
import { formatMeters, formatZScore } from "@/lib/format/statistics";
import type { ZScoreRecord } from "@/types/statistics";

type ZScoreTableProps = Readonly<{
  records: readonly ZScoreRecord[];
}>;

export function ZScoreTable({ records }: ZScoreTableProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Tabel Z-Score</CardTitle>
            <CardDescription>
              Normalisasi jarak setiap kos terhadap rata-rata dan standar
              deviasi sampel.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-slate-200 text-slate-600">
            Simpangan baku sampel
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-right">No</TableHead>
              <TableHead>Nama Kos</TableHead>
              <TableHead className="text-right">Jarak (m)</TableHead>
              <TableHead className="text-right">Z-Score</TableHead>
              <TableHead>Interpretasi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={record.id}>
                <TableCell className="text-right font-mono text-slate-500">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium text-slate-900">
                  {record.name}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatMeters(record.distance, 0)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatZScore(record.zScore)}
                </TableCell>
                <TableCell>{getZScoreInterpretation(record.zScore)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function getZScoreInterpretation(zScore: number): string {
  const absoluteZScore = Math.abs(zScore);

  if (absoluteZScore >= 3) {
    return zScore > 0
      ? "Data sangat ekstrem; jarak jauh di atas rata-rata."
      : "Data sangat ekstrem; jarak jauh di bawah rata-rata.";
  }

  if (absoluteZScore >= 2) {
    return zScore > 0
      ? "Data cukup ekstrem; jarak di atas rata-rata."
      : "Data cukup ekstrem; jarak di bawah rata-rata.";
  }

  if (absoluteZScore <= 0.1) {
    return "Jarak dekat dengan rata-rata.";
  }

  if (zScore < 0) {
    return "Jarak di bawah rata-rata.";
  }

  return "Jarak di atas rata-rata.";
}
