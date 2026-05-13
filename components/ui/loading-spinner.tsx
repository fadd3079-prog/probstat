import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type LoadingSpinnerProps = ComponentPropsWithoutRef<"span"> & {
  label?: string;
};

export function LoadingSpinner({
  className,
  label = "Memuat data...",
  ...props
}: LoadingSpinnerProps) {
  return (
    <span
      aria-label={label}
      role="status"
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      {...props}
    />
  );
}
