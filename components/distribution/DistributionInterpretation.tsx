import { BookOpenText } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatFrequencyIntervalLabel,
  formatFrequencyPercentage,
} from "@/lib/format/frequency";
import { formatNumber } from "@/lib/format/statistics";
import type { FrequencyClass, FrequencyDistribution } from "@/types/frequency";

type DistributionInterpretationProps = Readonly<{
  distribution: FrequencyDistribution;
}>;

export function DistributionInterpretation({
  distribution,
}: DistributionInterpretationProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Interpretasi Distribusi</CardTitle>
        <CardDescription>
          Ringkasan berdasarkan tabel distribusi frekuensi aktif.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="border-slate-200 bg-slate-50">
          <BookOpenText className="size-4 text-slate-600" aria-hidden="true" />
          <AlertTitle>Ringkasan akademik</AlertTitle>
          <AlertDescription className="space-y-3">
            {buildInterpretation(distribution).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function buildInterpretation(distribution: FrequencyDistribution): string[] {
  const modalInterval = distribution.modeInterval;

  if (!modalInterval || distribution.totalCount === 0) {
    return [
      "Belum ada data kos aktif yang dapat disusun menjadi distribusi frekuensi.",
    ];
  }

  const modalText = distribution.hasMultipleModalIntervals
    ? `interval dengan frekuensi tertinggi adalah ${distribution.modalIntervals
        .map(formatFrequencyIntervalLabel)
        .join(", ")}`
    : `interval dengan jumlah kos terbanyak adalah ${formatFrequencyIntervalLabel(
        modalInterval,
      )}`;
  const concentrationText = describeConcentration(distribution);

  return [
    `Berdasarkan distribusi frekuensi, ${modalText}, yaitu sebanyak ${formatNumber(
      modalInterval.frequency,
      0,
    )} kos atau ${formatFrequencyPercentage(
      modalInterval.percentage,
    )} dari total data aktif.`,
    concentrationText,
    "Hasil ini hanya menjelaskan sebaran kos dalam sampel berdasarkan jarak dalam meter. Interpretasi ini tidak menyatakan jumlah mahasiswa yang tinggal pada setiap rentang jarak.",
  ];
}

function describeConcentration(distribution: FrequencyDistribution): string {
  if (distribution.hasMultipleModalIntervals) {
    return "Data belum menunjukkan satu rentang dominan yang jelas karena beberapa interval memiliki frekuensi tertinggi yang sama.";
  }

  const modalInterval = distribution.modeInterval;

  if (!modalInterval) {
    return "Pola konsentrasi data belum dapat ditentukan.";
  }

  const rangeCategory = getRangeCategory(modalInterval);

  return `Berdasarkan kelas modus, kos dalam sampel tampak lebih terkonsentrasi pada rentang ${rangeCategory}. Pembacaan ini tetap bersifat deskriptif dan bergantung pada data kos yang sudah dikumpulkan.`;
}

function getRangeCategory(
  frequencyClass: Pick<FrequencyClass, "lowerBound" | "upperBound" | "midpoint">,
): "dekat" | "menengah" | "jauh" {
  const referencePoint =
    frequencyClass.midpoint ??
    frequencyClass.upperBound ??
    frequencyClass.lowerBound;

  if (referencePoint <= 750) {
    return "dekat";
  }

  if (referencePoint <= 1500) {
    return "menengah";
  }

  return "jauh";
}
