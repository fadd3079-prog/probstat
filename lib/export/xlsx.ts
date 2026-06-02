import type { ExportTableRow } from "@/lib/report/generate-report-data";

export type XlsxSheet = Readonly<{
  name: string;
  rows: readonly ExportTableRow[];
}>;

export async function downloadXlsxFile(
  fileName: string,
  sheets: readonly XlsxSheet[],
): Promise<void> {
  const xlsx = await import("xlsx");
  const workbook = xlsx.utils.book_new();

  sheets.forEach((sheet) => {
    const worksheet = xlsx.utils.json_to_sheet(
      sheet.rows.map(normalizeRowForWorksheet),
    );

    xlsx.utils.book_append_sheet(
      workbook,
      worksheet,
      normalizeSheetName(sheet.name),
    );
  });

  xlsx.writeFile(workbook, fileName, {
    compression: true,
  });
}

function normalizeRowForWorksheet(
  row: ExportTableRow,
): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, value ?? ""]),
  );
}

function normalizeSheetName(name: string): string {
  return name.replace(/[\\/?*\[\]:]/g, "").slice(0, 31) || "Sheet";
}
