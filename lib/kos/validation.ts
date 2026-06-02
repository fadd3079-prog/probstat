import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : ""))
  .pipe(z.union([z.literal(""), z.url("URL Google Maps tidak valid.")]));

export const kosDataFormSchema = z.object({
  namaKos: z
    .string()
    .trim()
    .min(3, "Nama kos wajib diisi minimal 3 karakter.")
    .max(120, "Nama kos maksimal 120 karakter.")
    .refine(
      (value) => !/^\d+$/.test(value.replace(/\s+/g, "")),
      "Nama kos tidak boleh hanya berupa angka.",
    ),
  area: z
    .string()
    .trim()
    .max(100, "Area maksimal 100 karakter.")
    .optional()
    .transform((value) => value ?? ""),
  jarakMeter: z
    .number("Jarak meter wajib berupa angka.")
    .int("Jarak meter harus berupa bilangan bulat.")
    .min(1, "Jarak meter wajib lebih dari 0.")
    .max(10000, "Jarak meter maksimal 10000 meter."),
  googleMapsUrl: optionalUrlSchema,
  catatan: z
    .string()
    .trim()
    .max(500, "Catatan maksimal 500 karakter.")
    .optional()
    .transform((value) => value ?? ""),
});

export type KosDataFormValues = z.infer<typeof kosDataFormSchema>;
export type KosDataFormInputValues = z.input<typeof kosDataFormSchema>;

export const kosRecordIdSchema = z.object({
  id: z.uuid("ID data kos tidak valid."),
});
