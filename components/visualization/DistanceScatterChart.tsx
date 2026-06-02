"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
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
import { formatMeters, formatNumber } from "@/lib/format/statistics";
import type { DistanceObservation } from "@/types/statistics";

type DistanceScatterChartProps = Readonly<{
  observations: readonly DistanceObservation[];
}>;

type ScatterDatum = Readonly<{
  index: number;
  name: string;
  distance: number;
}>;

type ScatterTooltipPayload = Readonly<{
  payload: ScatterDatum;
}>;

type ScatterTooltipProps = Readonly<{
  active?: boolean;
  payload?: ScatterTooltipPayload[];
}>;

export function DistanceScatterChart({
  observations,
}: DistanceScatterChartProps) {
  const data = observations.map((observation, index) => ({
    index: index + 1,
    name: observation.name,
    distance: observation.distance,
  }));

  return (
    <Card className="h-full border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Scatter Plot Jarak</CardTitle>
        <CardDescription>
          Setiap titik mewakili satu kos; sumbu X adalah urutan data aktif.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <ScatterChart margin={{ bottom: 16, left: 0, right: 18, top: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis
                allowDecimals={false}
                dataKey="index"
                name="Urutan data"
                tick={{ fill: "#475569", fontSize: 12 }}
                tickLine={false}
                type="number"
              />
              <YAxis
                dataKey="distance"
                name="Jarak meter"
                tick={{ fill: "#475569", fontSize: 12 }}
                tickFormatter={(value) => formatNumber(Number(value), 0)}
                tickLine={false}
                type="number"
              />
              <Tooltip
                content={<ScatterTooltip />}
                cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }}
              />
              <Scatter
                data={data}
                dataKey="distance"
                fill="#0f766e"
                isAnimationActive={false}
                name="Jarak kos"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ScatterTooltip({ active, payload }: ScatterTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const datum = payload[0]?.payload;

  if (!datum) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm">
      <p className="font-medium text-slate-900">{datum.name}</p>
      <p className="mt-1 text-slate-600">
        Urutan:{" "}
        <span className="font-mono text-slate-900">
          {formatNumber(datum.index, 0)}
        </span>
      </p>
      <p className="mt-1 text-slate-600">
        Jarak:{" "}
        <span className="font-mono text-slate-900">
          {formatMeters(datum.distance, 0)}
        </span>
      </p>
    </div>
  );
}
