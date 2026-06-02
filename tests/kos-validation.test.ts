import { describe, expect, it } from "vitest";

import { kosDataFormSchema } from "../lib/kos/validation";

describe("kos data form validation", () => {
  it("accepts an empty optional Google Maps URL", () => {
    const result = kosDataFormSchema.safeParse({
      namaKos: "Kos Melati",
      area: "Balter",
      jarakMeter: 850,
      googleMapsUrl: "",
      catatan: "",
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid Google Maps URL and numeric jarak meter", () => {
    const result = kosDataFormSchema.safeParse({
      namaKos: "Kos Mawar",
      area: "Kalimanah",
      jarakMeter: 1200,
      googleMapsUrl: "https://maps.google.com/?q=FT+Unsoed",
      catatan: "Diukur manual dengan mode motor.",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.jarakMeter).toBe(1200);
    }
  });

  it("rejects an invalid Google Maps URL", () => {
    const result = kosDataFormSchema.safeParse({
      namaKos: "Kos Kenanga",
      area: "Balter",
      jarakMeter: 900,
      googleMapsUrl: "bukan-url",
      catatan: "",
    });

    expect(result.success).toBe(false);
  });

  it("enforces PRD length and distance boundaries", () => {
    expect(
      kosDataFormSchema.safeParse({
        namaKos: "AB",
        area: "Balter",
        jarakMeter: 100,
        googleMapsUrl: "",
        catatan: "",
      }).success,
    ).toBe(false);
    expect(
      kosDataFormSchema.safeParse({
        namaKos: "123",
        area: "Balter",
        jarakMeter: 100,
        googleMapsUrl: "",
        catatan: "",
      }).success,
    ).toBe(false);
    expect(
      kosDataFormSchema.safeParse({
        namaKos: "Kos Batas",
        area: "A".repeat(101),
        jarakMeter: 100,
        googleMapsUrl: "",
        catatan: "",
      }).success,
    ).toBe(false);
    expect(
      kosDataFormSchema.safeParse({
        namaKos: "Kos Batas",
        area: "Balter",
        jarakMeter: 10001,
        googleMapsUrl: "",
        catatan: "",
      }).success,
    ).toBe(false);
  });

  it("accepts the maximum valid distance and area length", () => {
    const result = kosDataFormSchema.safeParse({
      namaKos: "Kos Batas",
      area: "A".repeat(100),
      jarakMeter: 10000,
      googleMapsUrl: "",
      catatan: "",
    });

    expect(result.success).toBe(true);
  });
});
