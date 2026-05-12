import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { formatMeters, formatNumber } from "@/lib/format/statistics";
import type { IqrOutlierResult } from "@/types/statistics";

type OutlierPanelProps = Readonly<{
  result: IqrOutlierResult;
}>;

export function OutlierPanel({ result }: OutlierPanelProps) {
  const summaryItems = [
    ["Q1", formatMeters(result.q1)],
    ["Q3", formatMeters(result.q3)],
    ["IQR", formatMeters(result.iqr)],
    ["Lower fence", formatMeters(result.lowerFence)],
    ["Upper fence", formatMeters(result.upperFence)],
    ["Outlier", formatNumber(result.outliers.length, 0)],
  ] as const;
  const hasOutliers = result.outliers.length > 0;

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Analisis Outlier IQR</CardTitle>
            <CardDescription>
              Outlier dihitung dengan batas Q1 - 1.5 IQR dan Q3 + 1.5 IQR.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={
              hasOutliers
                ? "border-amber-200 text-amber-700"
                : "border-emerald-200 text-emerald-700"
            }
          >
            {hasOutliers ? "Perlu review" : "Tidak ada outlier"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-6 gap-3">
          {summaryItems.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
                {label}
              </p>
              <p className="mt-2 font-mono text-sm font-semibold text-slate-900">
                {value}
              </p>
            </div>
          ))}
        </div>

        <Alert
          className={
            hasOutliers
              ? "border-amber-200 bg-amber-50"
              : "border-emerald-200 bg-emerald-50"
          }
        >
          {hasOutliers ? (
            <AlertTriangle className="size-4 text-amber-700" aria-hidden="true" />
          ) : (
            <CheckCircle2
              className="size-4 text-emerald-700"
              aria-hidden="true"
            />
          )}
          <AlertTitle>
            {hasOutliers
              ? "Ditemukan data di luar batas IQR."
              : "Tidak ditemukan outlier IQR."}
          </AlertTitle>
          <AlertDescription>{buildOutlierInterpretation(result)}</AlertDescription>
        </Alert>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kos</TableHead>
              <TableHead>Jarak Meter</TableHead>
              <TableHead>Alasan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.outliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-slate-500">
                  Tidak ada kos yang berada di luar lower fence atau upper fence.
                </TableCell>
              </TableRow>
            ) : (
              result.outliers.map((outlier) => (
                <TableRow key={outlier.id}>
                  <TableCell className="font-medium text-slate-900">
                    {outlier.name}
                  </TableCell>
                  <TableCell className="font-mono text-slate-900">
                    {formatMeters(outlier.distance, 0)}
                  </TableCell>
                  <TableCell>
                    {outlier.reason === "below_lower_fence"
                      ? "Di bawah lower fence"
                      : "Di atas upper fence"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function buildOutlierInterpretation(result: IqrOutlierResult): string {
  if (result.q1 === null || result.q3 === null || result.iqr === null) {
    return "Analisis outlier belum dapat dihitung karena data jarak kos belum tersedia.";
  }

  if (result.outliers.length === 0) {
    return "Berdasarkan metode IQR, seluruh data kos aktif masih berada dalam rentang fence. Hal ini tidak berarti semua jarak sama, hanya tidak ada nilai yang melewati batas outlier IQR.";
  }

  return `Terdapat ${formatNumber(result.outliers.length, 0)} data kos yang melewati batas IQR. Data tersebut perlu diverifikasi sebagai jarak ekstrem atau kemungkinan kesalahan input, bukan langsung dihapus dari analisis.`;
}
