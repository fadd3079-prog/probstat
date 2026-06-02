"use client";

import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
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
import type { QqPlotData, QqPlotPoint } from "@/types/normality";

type QqPlotChartProps = Readonly<{
  data: QqPlotData;
}>;

type QqChartDatum = QqPlotPoint;

type QqTooltipPayload = Readonly<{
  payload: QqChartDatum;
}>;

type QqTooltipProps = Readonly<{
  active?: boolean;
  payload?: QqTooltipPayload[];
}>;

export function QqPlotChart({ data }: QqPlotChartProps) {
  const referenceData = buildReferenceLineData(data);

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>QQ Plot Normalitas</CardTitle>
        <CardDescription>
          Membandingkan kuantil sampel jarak kos dengan kuantil teoritis normal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <ComposedChart margin={{ bottom: 22, left: 8, right: 22, top: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis
                dataKey="theoreticalQuantile"
                name="Theoretical Quantiles"
                tick={{ fill: "#475569", fontSize: 12 }}
                tickLine={false}
                type="number"
              />
              <YAxis
                dataKey="sampleQuantile"
                name="Sample Quantiles"
                tick={{ fill: "#475569", fontSize: 12 }}
                tickFormatter={(value) => formatNumber(Number(value), 0)}
                tickLine={false}
                type="number"
              />
              <Tooltip content={<QqTooltip />} cursor={{ stroke: "#94a3b8" }} />
              {referenceData.length > 0 ? (
                <Line
                  data={referenceData}
                  dataKey="sampleQuantile"
                  dot={false}
                  isAnimationActive={false}
                  name="Garis acuan normal"
                  stroke="#dc2626"
                  strokeWidth={2}
                  type="linear"
                />
              ) : null}
              <Scatter
                data={data.points}
                dataKey="sampleQuantile"
                fill="#334155"
                isAnimationActive={false}
                name="Kos"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
          <span>X: Theoretical Quantiles</span>
          <span>Y: Sample Quantiles</span>
          <span>Garis merah: referensi normal berdasarkan mean dan simpangan baku sampel</span>
        </div>
        <p className="mt-4 text-sm text-slate-600">{data.interpretation}</p>
        {data.warning ? (
          <p className="mt-2 text-sm text-amber-700">{data.warning}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function buildReferenceLineData(data: QqPlotData) {
  const { intercept, slope } = data.referenceLine;

  if (
    data.points.length === 0 ||
    intercept === null ||
    slope === null ||
    slope === 0
  ) {
    return [];
  }

  const theoreticalQuantiles = data.points.map(
    (point) => point.theoreticalQuantile,
  );
  const minimumX = Math.min(...theoreticalQuantiles);
  const maximumX = Math.max(...theoreticalQuantiles);

  return [minimumX, maximumX].map((theoreticalQuantile) => ({
    theoreticalQuantile,
    sampleQuantile: intercept + slope * theoreticalQuantile,
  }));
}

function QqTooltip({ active, payload }: QqTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const datum = payload.find((item) => "kosName" in item.payload)?.payload;

  if (!datum) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm">
      <p className="font-medium text-slate-900">{datum.kosName}</p>
      <p className="mt-1 text-slate-600">
        Jarak:{" "}
        <span className="font-mono text-slate-900">
          {formatMeters(datum.distance, 0)}
        </span>
      </p>
      <p className="mt-1 text-slate-600">
        Theoretical:{" "}
        <span className="font-mono text-slate-900">
          {formatNumber(datum.theoreticalQuantile, 3)}
        </span>
      </p>
      <p className="mt-1 text-slate-600">
        Sample:{" "}
        <span className="font-mono text-slate-900">
          {formatMeters(datum.sampleQuantile, 0)}
        </span>
      </p>
    </div>
  );
}
