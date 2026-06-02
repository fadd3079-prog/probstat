import {
  MEASUREMENT_METHOD,
  RESEARCH_TITLE,
  ROUTE_MODE,
  SAMPLING_METHOD,
  TARGET_DESTINATION,
} from "@/lib/constants";
import { formatFrequencyIntervalLabel } from "@/lib/format/frequency";
import { formatMeters, formatNumber } from "@/lib/format/statistics";
import type { FrequencyClass } from "@/types/frequency";
import type { NormalityDecision } from "@/types/normality";
import type { DescriptiveStatistics } from "@/types/statistics";

export type GroupMember = Readonly<{
  no: number;
  name: string;
  nim: string;
}>;

export const GROUP_MEMBERS: readonly GroupMember[] = [
  { no: 1, name: "Fardizza Vinda Rahman", nim: "H1D025067" },
  { no: 2, name: "Muhammad Fattachul Fawwaz", nim: "H1D025068" },
  { no: 3, name: "Mufaddhol", nim: "H1D025069" },
  { no: 4, name: "Balqis Safitri", nim: "H1D025070" },
  { no: 5, name: "Alika Salsabila", nim: "H1D025071" },
];

export const REPORT_TITLE = RESEARCH_TITLE;

export const REPORT_SUBTITLE =
  "Laporan hasil analisis jarak kos-kosan di sekitar FT Unsoed menuju titik acuan gerbang kampus.";

export const REPORT_METHODOLOGY = {
  metodePengumpulanData: MEASUREMENT_METHOD,
  metodeSampling: SAMPLING_METHOD,
  modeRute: ROUTE_MODE,
  titikTujuan: TARGET_DESTINATION,
  unitObservasi: "Kos-kosan",
  variabelUtama: "Jarak kos ke titik acuan gerbang kampus dalam meter",
} as const;

export function getNormalityDecisionLabel(
  decision: NormalityDecision,
): string {
  if (decision === "normal") {
    return "H0 diterima, data cenderung berdistribusi normal";
  }

  if (decision === "not_normal") {
    return "H0 ditolak, data tidak berdistribusi normal";
  }

  return "Belum dapat diputuskan";
}

export function buildReportConclusion({
  modalInterval,
  normalityDecision,
  stats,
}: Readonly<{
  modalInterval: FrequencyClass | null;
  normalityDecision: NormalityDecision;
  stats: DescriptiveStatistics;
}>): string {
  if (stats.n === 0) {
    return "Kesimpulan belum dapat dibuat karena belum ada data kos aktif yang dianalisis.";
  }

  const averageText = formatMeters(stats.mean, 2);
  const medianText = formatMeters(stats.median, 2);
  const intervalText = modalInterval
    ? formatFrequencyIntervalLabel(modalInterval)
    : "belum tersedia";
  const normalityText =
    normalityDecision === "normal"
      ? "Hasil uji normalitas menunjukkan data jarak kos dapat diperlakukan normal pada taraf signifikansi 5%."
      : normalityDecision === "not_normal"
        ? "Hasil uji normalitas menunjukkan data jarak kos tidak berdistribusi normal pada taraf signifikansi 5%; hal ini bukan kegagalan penelitian, melainkan karakteristik sebaran data."
        : "Hasil uji normalitas belum dapat diputuskan karena jumlah data atau variasi jarak belum memadai.";

  return `Berdasarkan ${formatNumber(stats.n, 0)} sampel kos aktif, rata-rata jarak kos adalah ${averageText} dengan median ${medianText}. Interval jarak dengan frekuensi tertinggi adalah ${intervalText}. ${normalityText} Interpretasi ini menjelaskan sebaran jarak kos-kosan, bukan sebaran tempat tinggal mahasiswa.`;
}
