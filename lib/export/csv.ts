import type { ExportCellValue, ExportTableRow } from "@/lib/report/generate-report-data";

export function createCsvContent(rows: readonly ExportTableRow[]): string {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0] ?? {});
  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(","),
    ),
  ];

  return `\uFEFF${lines.join("\r\n")}`;
}

function escapeCsvValue(value: ExportCellValue | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  const rawValue = String(value);
  const shouldQuote = /[",\r\n]/.test(rawValue);
  const escapedValue = rawValue.replaceAll('"', '""');

  return shouldQuote ? `"${escapedValue}"` : escapedValue;
}
