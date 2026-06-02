"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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
import type { FrequencyDistribution } from "@/types/frequency";

type FrequencyDonutChartProps = Readonly<{
  distribution: FrequencyDistribution;
}>;

type DonutDatum = Readonly<{
  interval: string;
  frequency: number;
  percentage: number;
}>;

type DonutTooltipPayload = Readonly<{
  payload: DonutDatum;
}>;

type DonutTooltipProps = Readonly<{
  active?: boolean;
  payload?: DonutTooltipPayload[];
}>;

const DONUT_COLORS = [
  "#334155",
  "#0f766e",
  "#7c3aed",
  "#b45309",
  "#0369a1",
  "#be123c",
  "#4d7c0f",
  "#6d28d9",
  "#475569",
] as const;

export function FrequencyDonutChart({
  distribution,
}: FrequencyDonutChartProps) {
  const data = distribution.classes
    .filter((frequencyClass) => frequencyClass.frequency > 0)
    .map((frequencyClass) => ({
      interval: formatFrequencyIntervalLabel(frequencyClass),
      frequency: frequencyClass.frequency,
      percentage: frequencyClass.percentage,
    }));

  return (
    <Card className="h-full border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Diagram Donut Persentase</CardTitle>
        <CardDescription>
          Ringkasan komposisi kos pada setiap interval jarak.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Tooltip content={<DonutTooltip />} />
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey="frequency"
                innerRadius={62}
                isAnimationActive={false}
                nameKey="interval"
                outerRadius={104}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {data.map((datum, index) => (
                  <Cell
                    fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    key={datum.interval}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {data.slice(0, 6).map((datum, index) => (
            <div key={datum.interval} className="flex items-center gap-2 text-xs">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{
                  backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length],
                }}
              />
              <span className="truncate text-slate-600">{datum.interval}</span>
              <span className="ml-auto font-mono text-slate-900">
                {formatFrequencyPercentage(datum.percentage)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const datum = payload[0]?.payload;

  if (!datum) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm">
      <p className="font-medium text-slate-900">{datum.interval}</p>
      <p className="mt-1 text-slate-600">
        Frekuensi:{" "}
        <span className="font-mono text-slate-900">
          {formatNumber(datum.frequency, 0)} kos
        </span>
      </p>
      <p className="mt-1 text-slate-600">
        Persentase:{" "}
        <span className="font-mono text-slate-900">
          {formatFrequencyPercentage(datum.percentage)}
        </span>
      </p>
    </div>
  );
}
