import {
  calculateDescriptiveStatistics,
  calculateManualFrequencyDistribution,
  calculateZScores,
  performLillieforsNormalityTest,
} from "@/lib/statistics";
import { formatFrequencyIntervalLabel } from "@/lib/format/frequency";
import {
  formatMeters,
  formatNumber,
  formatPercent,
  formatZScore,
} from "@/lib/format/statistics";
import type { FrequencyClass } from "@/types/frequency";
import type { KosDataRecord } from "@/types/kos";

import {
  GROUP_MEMBERS,
  REPORT_METHODOLOGY,
  REPORT_SUBTITLE,
  REPORT_TITLE,
  buildReportConclusion,
  getNormalityDecisionLabel,
  type GroupMember,
} from "./report-copy";

export type ExportCellValue = string | number | null;

export type ExportTableRow = Readonly<Record<string, ExportCellValue>>;

export type ReportExportData = Readonly<{
  title: string;
  subtitle: string;
  generatedAt: string;
  generatedAtLabel: string;
  members: readonly GroupMember[];
  methodology: typeof REPORT_METHODOLOGY;
  rowCount: number;
  rawDataRows: readonly ExportTableRow[];
  descriptiveRows: readonly ExportTableRow[];
  frequencyRows: readonly ExportTableRow[];
  normalitySummaryRows: readonly ExportTableRow[];
  normalityRows: readonly ExportTableRow[];
  frequencyInterpretation: string;
  normalityInterpretation: string;
  normalityDecisionLabel: string;
  conclusion: string;
}>;

export type GenerateReportDataOptions = Readonly<{
  profileNameById?: ReadonlyMap<string, string>;
  generatedAt?: Date;
}>;

export function generateReportData(
  records: readonly KosDataRecord[],
  options: GenerateReportDataOptions = {},
): ReportExportData {
  const observations = records.map((record) => ({
    id: record.id,
    name: record.namaKos,
    distance: record.jarakMeter,
  }));
  const stats = calculateDescriptiveStatistics(observations);
  const frequency = calculateManualFrequencyDistribution(observations);
  const zScores = calculateZScores(observations);
  const normality = performLillieforsNormalityTest(observations);
  const zScoreByKosId = new Map(
    zScores.records.map((record) => [record.kosId, record.zScore]),
  );
  const generatedAt = options.generatedAt ?? new Date();
  const conclusion = buildReportConclusion({
    modalInterval: frequency.modeInterval,
    normalityDecision: normality.decision,
    stats,
  });

  return {
    title: REPORT_TITLE,
    subtitle: REPORT_SUBTITLE,
    generatedAt: generatedAt.toISOString(),
    generatedAtLabel: formatDateTime(generatedAt.toISOString()),
    members: GROUP_MEMBERS,
    methodology: REPORT_METHODOLOGY,
    rowCount: records.length,
    rawDataRows: records.map((record, index) =>
      buildRawDataRow({
        index,
        interval: findFrequencyClass(record.jarakMeter, frequency.classes),
        record,
        zScore: zScoreByKosId.get(record.id) ?? null,
        profileNameById: options.profileNameById,
      }),
    ),
    descriptiveRows: buildDescriptiveRows(stats),
    frequencyRows: frequency.classes.map(buildFrequencyRow),
    normalitySummaryRows: [
      { Metrik: "Jumlah data", Nilai: normality.n },
      { Metrik: "Alpha", Nilai: formatNumber(normality.alpha, 2) },
      { Metrik: "Mean", Nilai: formatMeters(normality.mean, 2) },
      {
        Metrik: "Sample standard deviation",
        Nilai: formatMeters(normality.standardDeviation, 2),
      },
      { Metrik: "Lhitung", Nilai: formatNumber(normality.lHitung, 4) },
      { Metrik: "Ltabel", Nilai: formatNumber(normality.lTable, 4) },
      {
        Metrik: "Keputusan",
        Nilai: getNormalityDecisionLabel(normality.decision),
      },
    ],
    normalityRows: normality.rows.map((row) => ({
      No: row.no,
      "Nama Kos": row.kosName,
      "Jarak Meter": row.distance,
      Zi: formatZScore(row.zi),
      "F(zi)": formatNumber(row.standardNormalCdf, 4),
      "S(zi)": formatNumber(row.empiricalCdf, 4),
      "|F(zi) - S(zi)|": formatNumber(row.absoluteDifference, 4),
    })),
    frequencyInterpretation: frequency.interpretation,
    normalityInterpretation: normality.interpretation,
    normalityDecisionLabel: getNormalityDecisionLabel(normality.decision),
    conclusion,
  };
}

function buildRawDataRow({
  index,
  interval,
  profileNameById,
  record,
  zScore,
}: Readonly<{
  index: number;
  interval: FrequencyClass | null;
  profileNameById?: ReadonlyMap<string, string>;
  record: KosDataRecord;
  zScore: number | null;
}>): ExportTableRow {
  const inputBy =
    record.createdBy && profileNameById?.has(record.createdBy)
      ? profileNameById.get(record.createdBy)
      : "Tidak diketahui";

  return {
    No: index + 1,
    "Nama Kos": record.namaKos,
    Area: record.area ?? "-",
    "Jarak Meter": record.jarakMeter,
    "Interval Jarak": interval
      ? formatFrequencyIntervalLabel(interval)
      : "Di luar interval",
    "Z-Score": zScore === null ? "-" : Number(zScore.toFixed(3)),
    "Status Data": formatDataQualityStatus(record.dataQualityStatus),
    "Google Maps URL": record.googleMapsUrl ?? "-",
    "Mode Rute": record.modeRute,
    "Titik Tujuan": record.titikTujuan,
    "Metode Ukur": record.metodePengukuran,
    "Input Oleh": inputBy ?? "Tidak diketahui",
    "Tanggal Input": formatDateTime(record.createdAt),
  };
}

function buildDescriptiveRows(stats: ReturnType<typeof calculateDescriptiveStatistics>) {
  return [
    { Metrik: "Jumlah data (n)", Nilai: stats.n },
    { Metrik: "Sum", Nilai: formatMeters(stats.sum, 0) },
    { Metrik: "Minimum", Nilai: formatMeters(stats.min, 0) },
    { Metrik: "Maksimum", Nilai: formatMeters(stats.max, 0) },
    { Metrik: "Range", Nilai: formatMeters(stats.range, 0) },
    { Metrik: "Mean", Nilai: formatMeters(stats.mean, 2) },
    { Metrik: "Median", Nilai: formatMeters(stats.median, 2) },
    {
      Metrik: "Modus data mentah",
      Nilai:
        stats.modeRaw.length > 0
          ? stats.modeRaw.map((value) => formatMeters(value, 0)).join(", ")
          : "-",
    },
    { Metrik: "Q1", Nilai: formatMeters(stats.q1, 2) },
    { Metrik: "Q2", Nilai: formatMeters(stats.q2, 2) },
    { Metrik: "Q3", Nilai: formatMeters(stats.q3, 2) },
    { Metrik: "IQR", Nilai: formatMeters(stats.iqr, 2) },
    { Metrik: "Lower fence", Nilai: formatMeters(stats.lowerFence, 2) },
    { Metrik: "Upper fence", Nilai: formatMeters(stats.upperFence, 2) },
    {
      Metrik: "Sample variance",
      Nilai: formatNumber(stats.sampleVariance, 2),
    },
    {
      Metrik: "Sample standard deviation",
      Nilai: formatMeters(stats.sampleStandardDeviation, 2),
    },
    {
      Metrik: "Population variance",
      Nilai: formatNumber(stats.populationVariance, 2),
    },
    {
      Metrik: "Population standard deviation",
      Nilai: formatMeters(stats.populationStandardDeviation, 2),
    },
    {
      Metrik: "Coefficient of variation",
      Nilai: formatPercent(stats.coefficientOfVariation, 2),
    },
    {
      Metrik: "Outlier IQR",
      Nilai:
        stats.outliers.length > 0
          ? `${formatNumber(stats.outliers.length, 0)} data`
          : "Tidak ada",
    },
  ] satisfies readonly ExportTableRow[];
}

function buildFrequencyRow(
  frequencyClass: FrequencyClass,
  index: number,
): ExportTableRow {
  return {
    No: index + 1,
    "Interval Jarak": formatFrequencyIntervalLabel(frequencyClass),
    "Batas Bawah": frequencyClass.lowerBound,
    "Batas Atas": frequencyClass.upperBound ?? "Tidak terbatas",
    "Titik Tengah": frequencyClass.midpoint ?? "-",
    Frekuensi: frequencyClass.frequency,
    "Frekuensi Relatif": Number(frequencyClass.relativeFrequency.toFixed(4)),
    Persentase: `${formatNumber(frequencyClass.percentage, 2)}%`,
    "Frekuensi Kumulatif": frequencyClass.cumulativeFrequency,
    "Persentase Kumulatif": `${formatNumber(
      frequencyClass.cumulativePercentage,
      2,
    )}%`,
  };
}

function findFrequencyClass(
  distance: number,
  frequencyClasses: readonly FrequencyClass[],
): FrequencyClass | null {
  return (
    frequencyClasses.find((frequencyClass) => {
      if (distance < frequencyClass.lowerBound) {
        return false;
      }

      if (frequencyClass.upperBound === null) {
        return true;
      }

      return distance <= frequencyClass.upperBound;
    }) ?? null
  );
}

function formatDataQualityStatus(
  status: KosDataRecord["dataQualityStatus"],
): string {
  const labels: Record<KosDataRecord["dataQualityStatus"], string> = {
    duplicate_suspected: "Duplikat Diduga",
    needs_review: "Perlu Ditinjau",
    valid: "Valid",
    warning: "Perlu Dicek",
  };

  return labels[status];
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
