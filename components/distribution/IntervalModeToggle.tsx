"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FrequencyIntervalMode } from "@/types/frequency";

type IntervalModeToggleProps = Readonly<{
  mode: FrequencyIntervalMode;
  onModeChange: (mode: FrequencyIntervalMode) => void;
}>;

const modeOptions: readonly {
  label: string;
  value: FrequencyIntervalMode;
}[] = [
  { label: "Interval Manual", value: "manual" },
  { label: "Interval Sturges", value: "sturges" },
];

export function IntervalModeToggle({
  mode,
  onModeChange,
}: IntervalModeToggleProps) {
  return (
    <div
      aria-label="Mode interval distribusi frekuensi"
      className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1"
      role="group"
    >
      {modeOptions.map((option) => {
        const isActive = mode === option.value;

        return (
          <Button
            key={option.value}
            aria-pressed={isActive}
            className={cn(
              "h-8 border-transparent px-4",
              isActive
                ? "bg-white text-slate-950 shadow-sm hover:bg-white"
                : "bg-transparent text-slate-600 hover:bg-white/70",
            )}
            type="button"
            variant="ghost"
            onClick={() => onModeChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
