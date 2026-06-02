"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

import { QqPlotChart } from "@/components/visualization/QqPlotChart";
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
import {
  formatMeters,
  formatNumber,
  formatZScore,
} from "@/lib/format/statistics";
import type { NormalityDecision, NormalityResult, QqPlotData } from "@/types/normality";

type NormalityDashboardProps = Readonly<{
  normality: NormalityResult;
  qqPlot: QqPlotData;
}>;

export function NormalityDashboard({
  normality,
  qqPlot,
}: NormalityDashboardProps) {
  return (
    <>
      <section className="col-span-12">
        <NormalityDecisionAlert normality={normality} />
      </section>

      <section className="col-span-12">
        <NormalitySummaryCards normality={normality} />
      </section>

      <section className="col-span-12 grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <HypothesisCard normality={normality} />
        </div>
        <div className="col-span-7">
          <InterpretationCard normality={normality} />
        </div>
      </section>

      <section className="col-span-12">
        <NormalityDetailTable normality={normality} />
      </section>

      <section className="col-span-12">
        <QqPlotChart data={qqPlot} />
      </section>
    </>
  );
}

function NormalityDecisionAlert({
  normality,
}: Readonly<{
  normality: NormalityResult;
}>) {
  const config = getDecisionConfig(normality.decision);
  const Icon = config.icon;

  return (
    <Alert className={config.className}>
      <Icon className="size-4" aria-hidden="true" />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>
        {normality.sampleSizeWarning} {config.description}
      </AlertDescription>
    </Alert>
  );
}

function NormalitySummaryCards({
  normality,
}: Readonly<{
  normality: NormalityResult;
}>) {
  const items = [
    {
      label: "Jumlah sampel",
      value: formatNumber(normality.n, 0),
      helper: "Unit observasi kos-kosan",
    },
    {
      label: "Alpha",
      value: formatNumber(normality.alpha, 2),
      helper: "Taraf signifikansi",
    },
    {
      label: "Mean",
      value: formatMeters(normality.mean, 2),
      helper: "Rata-rata jarak sampel",
    },
    {
      label: "Simpangan baku",
      value: formatMeters(normality.standardDeviation, 2),
      helper: "Sample standard deviation",
    },
    {
      label: "Lhitung",
      value: formatNumber(normality.lHitung, 4),
      helper: "Maksimum |F(zi) - S(zi)|",
    },
    {
      label: "Ltabel",
      value: formatNumber(normality.lTable, 4),
      helper: getLTableSourceLabel(normality.lTableSource),
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="border-slate-200 bg-white shadow-sm">
          <CardContent className="py-4">
            <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
              {item.label}
            </p>
            <p className="mt-2 font-mono text-xl font-semibold text-slate-950">
              {item.value}
            </p>
            <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function HypothesisCard({
  normality,
}: Readonly<{
  normality: NormalityResult;
}>) {
  return (
    <Card className="h-full border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Hipotesis Uji</CardTitle>
        <CardDescription>
          Liliefors-style normality test pada alpha 0,05.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <HypothesisItem label="H0" value={normality.h0} />
        <HypothesisItem label="H1" value={normality.h1} />
      </CardContent>
    </Card>
  );
}

function HypothesisItem({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <Badge variant="outline" className="border-slate-300 text-slate-700">
        {label}
      </Badge>
      <p className="mt-3 text-sm text-slate-700">{value}</p>
    </div>
  );
}

function InterpretationCard({
  normality,
}: Readonly<{
  normality: NormalityResult;
}>) {
  const decisionLabel = getDecisionConfig(normality.decision).badgeLabel;

  return (
    <Card className="h-full border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Keputusan dan Interpretasi</CardTitle>
            <CardDescription>
              Keputusan dibuat dari perbandingan Lhitung dan Ltabel.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-700">
            {decisionLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-700">
          {normality.interpretation}
        </p>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-900">
            Catatan akademik
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Jika data tidak berdistribusi normal, hal itu tidak dianggap sebagai
            kegagalan penelitian. Hasil tersebut hanya menjelaskan karakteristik
            sebaran jarak kos pada sampel yang dikumpulkan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function NormalityDetailTable({
  normality,
}: Readonly<{
  normality: NormalityResult;
}>) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Tabel Detail Uji Normalitas</CardTitle>
        <CardDescription>
          Data diurutkan dari jarak terkecil ke terbesar sebelum menghitung Zi,
          F(zi), S(zi), dan selisih absolut.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14 text-right">No</TableHead>
              <TableHead>Nama Kos</TableHead>
              <TableHead className="text-right">Jarak</TableHead>
              <TableHead className="text-right">Zi</TableHead>
              <TableHead className="text-right">F(zi)</TableHead>
              <TableHead className="text-right">S(zi)</TableHead>
              <TableHead className="text-right">|F(zi) - S(zi)|</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {normality.rows.map((row) => (
              <TableRow key={`${row.kosId}-${row.no}`}>
                <TableCell className="text-right font-mono text-slate-500">
                  {row.no}
                </TableCell>
                <TableCell className="font-medium text-slate-900">
                  {row.kosName}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatMeters(row.distance, 0)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatZScore(row.zi)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatNumber(row.standardNormalCdf, 4)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatNumber(row.empiricalCdf, 4)}
                </TableCell>
                <TableCell className="text-right font-mono text-slate-900">
                  {formatNumber(row.absoluteDifference, 4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function getDecisionConfig(decision: NormalityDecision) {
  if (decision === "normal") {
    return {
      badgeLabel: "H0 diterima",
      className: "border-emerald-200 bg-emerald-50 text-emerald-900",
      description:
        "Data jarak kos dapat dikatakan berdistribusi normal pada taraf signifikansi 5%.",
      icon: CheckCircle2,
      title: "Hasil uji: data cenderung normal",
    };
  }

  if (decision === "not_normal") {
    return {
      badgeLabel: "H0 ditolak",
      className: "border-amber-200 bg-amber-50 text-amber-900",
      description:
        "Data jarak kos tidak mengikuti pola normal pada taraf signifikansi 5%.",
      icon: XCircle,
      title: "Hasil uji: data tidak normal",
    };
  }

  return {
    badgeLabel: "Belum cukup data",
    className: "border-slate-200 bg-slate-50 text-slate-900",
    description:
      "Tambahkan data kos atau pastikan variasi jarak cukup agar uji dapat dihitung.",
    icon: AlertCircle,
    title: "Uji normalitas belum dapat diputuskan",
  };
}

function getLTableSourceLabel(source: NormalityResult["lTableSource"]) {
  if (source === "lookup") {
    return "Nilai tabel n <= 30";
  }

  if (source === "approximation") {
    return "Pendekatan 0,886 / akar n";
  }

  return "Tidak tersedia";
}
