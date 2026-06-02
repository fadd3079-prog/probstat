import { describe, expect, it } from "vitest";

import { determineKosDataQualityStatus } from "../lib/kos/data-quality";

const existingRecords = [
  {
    id: "a",
    namaKos: "Wisma Putri Melati",
    googleMapsUrl: "https://maps.google.com/?q=melati",
  },
  {
    id: "b",
    namaKos: "Kos Mawar",
    googleMapsUrl: null,
  },
] as const;

describe("kos data quality status", () => {
  it("marks reasonable non-duplicate distances as valid", () => {
    expect(
      determineKosDataQualityStatus(
        {
          namaKos: "Kos Kenanga",
          jarakMeter: 3000,
          googleMapsUrl: "",
        },
        existingRecords,
      ),
    ).toBe("valid");
  });

  it("marks distances above 3000 and up to 5000 as warning", () => {
    expect(
      determineKosDataQualityStatus(
        {
          namaKos: "Kos Jauh",
          jarakMeter: 5000,
          googleMapsUrl: "",
        },
        existingRecords,
      ),
    ).toBe("warning");
  });

  it("marks distances above 5000 as needs_review", () => {
    expect(
      determineKosDataQualityStatus(
        {
          namaKos: "Kos Sangat Jauh",
          jarakMeter: 5001,
          googleMapsUrl: "",
        },
        existingRecords,
      ),
    ).toBe("needs_review");
  });

  it("detects duplicate names case-insensitively after normalization", () => {
    expect(
      determineKosDataQualityStatus(
        {
          namaKos: "  wisma   putri   melati  ",
          jarakMeter: 100,
          googleMapsUrl: "",
        },
        existingRecords,
      ),
    ).toBe("duplicate_suspected");
  });

  it("detects duplicate Google Maps URLs case-insensitively", () => {
    expect(
      determineKosDataQualityStatus(
        {
          namaKos: "Kos Baru",
          jarakMeter: 100,
          googleMapsUrl: "HTTPS://MAPS.GOOGLE.COM/?Q=MELATI",
        },
        existingRecords,
      ),
    ).toBe("duplicate_suspected");
  });

  it("ignores the current record during edit duplicate checks", () => {
    expect(
      determineKosDataQualityStatus(
        {
          namaKos: "Wisma Putri Melati",
          jarakMeter: 100,
          googleMapsUrl: "https://maps.google.com/?q=melati",
        },
        existingRecords,
        "a",
      ),
    ).toBe("valid");
  });
});
