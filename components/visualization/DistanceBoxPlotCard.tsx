"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMeters } from "@/lib/format/statistics";
import type { BoxPlotSummary } from "@/types/statistics";

type DistanceBoxPlotCardProps = Readonly<{
  summary: BoxPlotSummary;
}>;

export function DistanceBoxPlotCard({ summary }: DistanceBoxPlotCardProps) {
  if (
    summary.min === null ||
    summary.q1 === null ||
    summary.median === null ||
    summary.q3 === null ||
    summary.max === null
  ) {
    return (
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Boxplot Jarak</CardTitle>
          <CardDescription>
            Boxplot akan muncul setelah data jarak kos tersedia.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const position = createPositionScale(summary.min, summary.max);
  const boxLeft = position(summary.q1);
  const boxRight = position(summary.q3);

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Boxplot Jarak Kos</CardTitle>
            <CardDescription>
              Ringkasan minimum, Q1, median, Q3, maksimum, dan outlier IQR.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-700">
            {summary.outliers.length} outlier
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div className="relative h-32">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-300" />
            <WhiskerCap label="Min" left={position(summary.min)} />
            <WhiskerCap label="Max" left={position(summary.max)} />
            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 bg-slate-500"
              style={{
                left: `${position(summary.min)}%`,
                width: `${Math.max(1, position(summary.max) - position(summary.min))}%`,
              }}
            />
            <div
              className="absolute top-1/2 h-16 -translate-y-1/2 rounded-md border border-slate-700 bg-white shadow-sm"
              style={{
                left: `${boxLeft}%`,
                width: `${Math.max(1, boxRight - boxLeft)}%`,
              }}
            />
            <div
              className="absolute top-1/2 h-20 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-rose-700"
              style={{ left: `${position(summary.median)}%` }}
            />
            {summary.outliers.map((outlier) => (
              <span
                aria-label={`${outlier.name}, ${formatMeters(outlier.distance, 0)}`}
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-700 bg-amber-100"
                key={outlier.id}
                style={{ left: `${position(outlier.distance)}%` }}
                title={`${outlier.name}: ${formatMeters(outlier.distance, 0)}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-5 gap-3">
            <BoxPlotValue label="Min" value={summary.min} />
            <BoxPlotValue label="Q1" value={summary.q1} />
            <BoxPlotValue label="Median" value={summary.median} />
            <BoxPlotValue label="Q3" value={summary.q3} />
            <BoxPlotValue label="Max" value={summary.max} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WhiskerCap({
  label,
  left,
}: Readonly<{
  label: string;
  left: number;
}>) {
  return (
    <div
      className="absolute top-1/2 flex h-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-between"
      style={{ left: `${left}%` }}
    >
      <span className="h-5 w-px bg-slate-700" />
      <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-slate-600">
        {label}
      </span>
      <span className="h-5 w-px bg-slate-700" />
    </div>
  );
}

function BoxPlotValue({
  label,
  value,
}: Readonly<{
  label: string;
  value: number;
}>) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 text-center">
      <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
        {formatMeters(value, 0)}
      </p>
    </div>
  );
}

function createPositionScale(minimum: number, maximum: number) {
  const range = maximum - minimum;

  return (value: number) => {
    if (range === 0) {
      return 50;
    }

    return ((value - minimum) / range) * 100;
  };
}
