import { BookOpenText } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMeters, formatPercent } from "@/lib/format/statistics";
import {
  MEASUREMENT_METHOD_LABEL,
  ROUTE_MODE_LABEL,
  TARGET_DESTINATION,
} from "@/lib/constants";
import type { DescriptiveStatistics } from "@/types/statistics";

type StatisticsInterpretationProps = Readonly<{
  stats: DescriptiveStatistics;
}>;

export function StatisticsInterpretation({
  stats,
}: StatisticsInterpretationProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Interpretasi Akademik</CardTitle>
        <CardDescription>
          Ringkasan berdasarkan statistik deskriptif data kos aktif.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="border-slate-200 bg-slate-50">
          <BookOpenText className="size-4 text-slate-600" aria-hidden="true" />
          <AlertTitle>Ringkasan interpretasi</AlertTitle>
          <AlertDescription className="space-y-3">
            {buildInterpretation(stats).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function buildInterpretation(stats: DescriptiveStatistics): string[] {
  if (stats.n === 0) {
    return [
      "Belum ada data kos aktif yang dapat dianalisis. Statistik deskriptif akan muncul setelah data jarak kos dimasukkan.",
    ];
  }

  const spreadDescription = describeSpread(stats.coefficientOfVariation);
  const standardDeviationText =
    stats.sampleStandardDeviation === null
      ? "Simpangan baku sampel belum dapat dihitung karena data baru berjumlah satu kos."
      : `Nilai standar deviasi sampel sebesar ${formatMeters(
          stats.sampleStandardDeviation,
        )} menunjukkan bahwa sebaran jarak kos ${spreadDescription}.`;

  return [
    `Berdasarkan ${stats.n} data kos aktif yang sudah masuk, rata-rata jarak kos ke titik acuan ${TARGET_DESTINATION} adalah ${formatMeters(
      stats.mean,
    )}. Median sebesar ${formatMeters(
      stats.median,
    )} menunjukkan posisi tengah jarak kos setelah data diurutkan.`,
    `${standardDeviationText} Koefisien variasi tercatat ${formatPercent(
      stats.coefficientOfVariation,
    )}, sehingga angka ini dapat digunakan sebagai gambaran relatif variasi jarak terhadap rata-rata.`,
    `Rentang data berada dari ${formatMeters(stats.min)} sampai ${formatMeters(
      stats.max,
    )}, dengan IQR sebesar ${formatMeters(
      stats.iqr,
    )}. Pengukuran tetap menggunakan ${MEASUREMENT_METHOD_LABEL}, mode rute ${ROUTE_MODE_LABEL}, dan variabel yang dianalisis adalah jarak kos dalam meter.`,
    "Interpretasi ini berlaku untuk unit observasi kos-kosan. Hasil ini tidak menyimpulkan sebaran tempat tinggal mahasiswa atau jumlah mahasiswa pada jarak tertentu.",
  ];
}

function describeSpread(
  coefficientOfVariation: number | null,
): "relatif rendah" | "sedang" | "cukup besar" | "belum dapat ditentukan" {
  if (coefficientOfVariation === null) {
    return "belum dapat ditentukan";
  }

  if (coefficientOfVariation < 15) {
    return "relatif rendah";
  }

  if (coefficientOfVariation < 30) {
    return "sedang";
  }

  return "cukup besar";
}
