import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { MIN_SAMPLE_SIZE } from "@/lib/constants";

type DataRequirementNoticeProps = Readonly<{
  n: number;
}>;

export function DataRequirementNotice({ n }: DataRequirementNoticeProps) {
  if (n >= MIN_SAMPLE_SIZE) {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 text-emerald-700"
      >
        <CheckCircle2 className="size-3" aria-hidden="true" />
        Jumlah data sudah memenuhi target awal 30 kos.
      </Badge>
    );
  }

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertCircle className="size-4 text-amber-700" aria-hidden="true" />
      <AlertTitle>Data masih sementara</AlertTitle>
      <AlertDescription>
        Jumlah data masih kurang dari target minimal 30 kos, sehingga hasil
        analisis masih bersifat sementara.
      </AlertDescription>
    </Alert>
  );
}
