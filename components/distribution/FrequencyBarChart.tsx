"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

type FrequencyBarChartProps = Readonly<{
  distribution: FrequencyDistribution;
}>;

type FrequencyChartDatum = Readonly<{
  interval: string;
  frequency: number;
  percentage: number;
}>;

type TooltipPayload = Readonly<{
  payload: FrequencyChartDatum;
}>;

type FrequencyTooltipProps = Readonly<{
  active?: boolean;
  payload?: TooltipPayload[];
}>;

export function FrequencyBarChart({ distribution }: FrequencyBarChartProps) {
  const data: FrequencyChartDatum[] = distribution.classes.map(
    (frequencyClass) => ({
      interval: formatFrequencyIntervalLabel(frequencyClass),
      frequency: frequencyClass.frequency,
      percentage: frequencyClass.percentage,
    }),
  );

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Diagram Batang Distribusi Frekuensi</CardTitle>
        <CardDescription>
          Sumbu X menampilkan interval jarak, sumbu Y menampilkan jumlah kos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={data}
              margin={{ bottom: 18, left: 0, right: 16, top: 8 }}
            >
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis
                dataKey="interval"
                interval={0}
                tick={{ fill: "#475569", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#475569", fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip content={<FrequencyTooltip />} cursor={{ fill: "#f1f5f9" }} />
              <Bar
                dataKey="frequency"
                fill="#334155"
                name="Frekuensi"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function FrequencyTooltip({ active, payload }: FrequencyTooltipProps) {
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
