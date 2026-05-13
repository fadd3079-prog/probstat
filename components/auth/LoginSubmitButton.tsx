"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button aria-busy={pending} disabled={pending} type="submit" className="w-full">
      {pending ? (
        <LoadingSpinner className="size-3.5" label="Memproses masuk..." />
      ) : null}
      {pending ? "Memproses..." : "Masuk"}
    </Button>
  );
}
