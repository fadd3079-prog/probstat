import type { DataQualityStatus } from "@/types/kos";

import { normalizeKosName } from "./normalize-text";

export type KosDataQualityCandidate = Readonly<{
  namaKos: string;
  jarakMeter: number;
  googleMapsUrl: string | null;
}>;

export type ExistingKosQualityRecord = Readonly<{
  id: string;
  namaKos: string;
  googleMapsUrl: string | null;
}>;

export function determineKosDataQualityStatus(
  candidate: KosDataQualityCandidate,
  existingRecords: readonly ExistingKosQualityRecord[],
  currentRecordId?: string,
): DataQualityStatus {
  const normalizedCandidateName = normalizeKosName(candidate.namaKos);
  const normalizedCandidateUrl = normalizeUrlForComparison(
    candidate.googleMapsUrl,
  );
  const hasDuplicate = existingRecords.some((record) => {
    if (record.id === currentRecordId) {
      return false;
    }

    const hasDuplicateName =
      normalizeKosName(record.namaKos) === normalizedCandidateName;
    const existingUrl = normalizeUrlForComparison(record.googleMapsUrl);
    const hasDuplicateUrl =
      normalizedCandidateUrl !== null && existingUrl === normalizedCandidateUrl;

    return hasDuplicateName || hasDuplicateUrl;
  });

  if (hasDuplicate) {
    return "duplicate_suspected";
  }

  if (candidate.jarakMeter > 5000) {
    return "needs_review";
  }

  if (candidate.jarakMeter > 3000) {
    return "warning";
  }

  return "valid";
}

function normalizeUrlForComparison(value: string | null): string | null {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  return trimmedValue.toLocaleLowerCase("id-ID");
}
