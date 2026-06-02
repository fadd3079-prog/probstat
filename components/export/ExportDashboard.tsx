"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  Clock3,
  Database,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Plus,
  ShieldAlert,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createCsvContent,
  createHtmlReport,
  createJsonContent,
  downloadXlsxFile,
} from "@/lib/export";
import type {
  ExportCellValue,
  ExportTableRow,
  ReportExportData,
} from "@/lib/report/generate-report-data";

type ExportKind = "csv" | "xlsx" | "json" | "html";

type ExportStatus = Readonly<{
  type: "success" | "error";
  message: string;
}>;

type ExportDashboardProps = Readonly<{
  reportData: ReportExportData;
}>;

const DATA_CSV_FILE_NAME = "data-kos-ft-unsoed.csv";
const DATA_XLSX_FILE_NAME = "data-kos-ft-unsoed.xlsx";
const DATA_JSON_FILE_NAME = "data-kos-ft-unsoed.json";
const REPORT_HTML_FILE_NAME = "laporan-jarak-kos-ft-unsoed.html";

export function ExportDashboard({ reportData }: ExportDashboardProps) {
  const [runningExport, setRunningExport] = useState<ExportKind | null>(null);
  const [status, setStatus] = useState<ExportStatus | null>(null);
  const hasData = reportData.rowCount > 0;
  const jsonPayload = useMemo(
    () => ({
      generatedAt: reportData.generatedAt,
      title: reportData.title,
      unitObservasi: reportData.methodology.unitObservasi,
      variabelUtama: reportData.methodology.variabelUtama,
      modeRute: reportData.methodology.modeRute,
      titikTujuan: reportData.methodology.titikTujuan,
      jumlahData: reportData.rowCount,
      data: reportData.rawDataRows,
    }),
    [reportData],
  );

  async function handleDownload(kind: ExportKind) {
    if (!hasData || runningExport) {
      return;
    }

    setRunningExport(kind);
    setStatus(null);

    try {
      if (kind === "csv") {
        downloadTextFile({
          content: createCsvContent(reportData.rawDataRows),
          fileName: DATA_CSV_FILE_NAME,
          mimeType: "text/csv;charset=utf-8",
        });
      }

      if (kind === "xlsx") {
        await downloadXlsxFile(DATA_XLSX_FILE_NAME, [
          { name: "Data Kos", rows: reportData.rawDataRows },
        ]);
      }

      if (kind === "json") {
        downloadTextFile({
          content: createJsonContent(jsonPayload),
          fileName: DATA_JSON_FILE_NAME,
          mimeType: "application/json;charset=utf-8",
        });
      }

      if (kind === "html") {
        downloadTextFile({
          content: createHtmlReport(reportData),
          fileName: REPORT_HTML_FILE_NAME,
          mimeType: "text/html;charset=utf-8",
        });
      }

      setStatus({
        type: "success",
        message: getSuccessMessage(kind),
      });
    } catch {
      setStatus({
        type: "error",
        message:
          "File belum berhasil dibuat. Coba ulangi proses ekspor dari halaman ini.",
      });
    } finally {
      setRunningExport(null);
    }
  }

  if (!hasData) {
    return <EmptyExportState />;
  }

  return (
    <div className="space-y-6">
      {status ? (
        <Alert
          className={
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : undefined
          }
          variant={status.type === "error" ? "destructive" : "default"}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="size-4" aria-hidden="true" />
          ) : (
            <ShieldAlert className="size-4" aria-hidden="true" />
          )}
          <AlertTitle>
            {status.type === "success" ? "Ekspor berhasil" : "Ekspor gagal"}
          </AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-6">
          <Card className="h-full border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Ekspor Data Mentah</CardTitle>
                  <CardDescription>
                    Berisi daftar data kos yang digunakan dalam analisis.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-slate-200 text-slate-600">
                  {reportData.rowCount} kos
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <ExportButton
                  disabled={runningExport !== null}
                  icon={FileText}
                  isLoading={runningExport === "csv"}
                  label="Unduh CSV"
                  onClick={() => void handleDownload("csv")}
                />
                <ExportButton
                  disabled={runningExport !== null}
                  icon={FileSpreadsheet}
                  isLoading={runningExport === "xlsx"}
                  label="Unduh Excel"
                  onClick={() => void handleDownload("xlsx")}
                />
                <ExportButton
                  disabled={runningExport !== null}
                  icon={FileJson}
                  isLoading={runningExport === "json"}
                  label="Unduh JSON"
                  onClick={() => void handleDownload("json")}
                />
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Data yang diunduh hanya berisi baris kos aktif dan tidak
                menyertakan data yang sudah dihapus dari dataset.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-6">
          <Card className="h-full border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Ekspor Ringkasan Analisis</CardTitle>
                  <CardDescription>
                    Berisi statistik deskriptif, distribusi frekuensi, dan
                    hasil uji normalitas.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-slate-200 text-slate-600">
                  Laporan
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <ExportButton
                  disabled={runningExport !== null}
                  icon={FileText}
                  isLoading={runningExport === "html"}
                  label="Unduh HTML"
                  onClick={() => void handleDownload("html")}
                />
                <DisabledExportButton label="Unduh PDF" />
                <DisabledExportButton label="Unduh DOCX" />
              </div>
              <p className="mt-4 text-sm text-slate-500">
                HTML sudah tersedia sebagai laporan mandiri yang bisa dibuka di
                browser dan dicetak. PDF dan DOCX disiapkan untuk tahap
                berikutnya.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <ReportPreview reportData={reportData} />
    </div>
  );
}

function ExportButton({
  disabled,
  icon: Icon,
  isLoading,
  label,
  onClick,
}: Readonly<{
  disabled: boolean;
  icon: typeof Download;
  isLoading: boolean;
  label: string;
  onClick: () => void;
}>) {
  return (
    <Button
      className="h-10 justify-center"
      disabled={disabled}
      type="button"
      variant="outline"
      onClick={onClick}
    >
      {isLoading ? (
        <LoadingSpinner className="size-4" label="Mengunduh..." />
      ) : (
        <Icon className="size-4" aria-hidden="true" />
      )}
      {isLoading ? "Mengunduh..." : label}
    </Button>
  );
}

function DisabledExportButton({ label }: Readonly<{ label: string }>) {
  return (
    <div className="space-y-2">
      <Button className="h-10 w-full justify-center" disabled type="button" variant="outline">
        <Clock3 className="size-4" aria-hidden="true" />
        {label}
      </Button>
      <p className="text-center text-xs font-medium text-slate-500">
        Segera tersedia
      </p>
    </div>
  );
}

function ReportPreview({ reportData }: Readonly<{ reportData: ReportExportData }>) {
  const memberRows = reportData.members.map(
    (member): ExportTableRow => ({
      No: member.no,
      Nama: member.name,
      NIM: member.nim,
    }),
  );

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Pratinjau Laporan</CardTitle>
            <CardDescription>
              Ringkasan isi laporan sebelum file diunduh.
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-slate-200 text-slate-600">
            {reportData.generatedAtLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <div className="border-b border-slate-200 pb-5">
            <p className="text-sm font-medium text-slate-500">
              Judul penelitian
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal text-slate-950">
              {reportData.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {reportData.subtitle}
            </p>
          </div>

          <PreviewSection title="Anggota kelompok">
            <SimpleTable rows={memberRows} />
          </PreviewSection>

          <PreviewSection title="Metode pengumpulan data">
            <div className="grid grid-cols-3 gap-4">
              <PreviewItem
                label="Metode"
                value={reportData.methodology.metodePengumpulanData}
              />
              <PreviewItem
                label="Unit observasi"
                value={reportData.methodology.unitObservasi}
              />
              <PreviewItem
                label="Variabel utama"
                value={reportData.methodology.variabelUtama}
              />
              <PreviewItem
                label="Mode rute"
                value={reportData.methodology.modeRute}
              />
              <PreviewItem
                label="Titik tujuan"
                value={reportData.methodology.titikTujuan}
              />
              <PreviewItem
                label="Jumlah data"
                value={`${reportData.rowCount} kos`}
              />
            </div>
          </PreviewSection>

          <PreviewSection title="Statistik deskriptif">
            <SimpleTable rows={reportData.descriptiveRows} />
          </PreviewSection>

          <PreviewSection title="Distribusi frekuensi">
            <p className="mb-3 text-sm leading-6 text-slate-600">
              {reportData.frequencyInterpretation}
            </p>
            <SimpleTable rows={reportData.frequencyRows} />
          </PreviewSection>

          <PreviewSection title="Hasil uji normalitas">
            <p className="mb-3 text-sm leading-6 text-slate-600">
              {reportData.normalityInterpretation}
            </p>
            <SimpleTable rows={reportData.normalitySummaryRows} />
          </PreviewSection>

          <PreviewSection title="Kesimpulan singkat">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm leading-6 text-slate-700">
                {reportData.conclusion}
              </p>
            </div>
          </PreviewSection>
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewSection({
  children,
  title,
}: Readonly<{
  children: ReactNode;
  title: string;
}>) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 text-base font-semibold text-slate-950">{title}</h3>
      {children}
    </section>
  );
}

function PreviewItem({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-normal text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function SimpleTable({
  rows,
}: Readonly<{
  rows: readonly ExportTableRow[];
}>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        Belum ada data untuk ditampilkan.
      </div>
    );
  }

  const headers = Object.keys(rows[0] ?? {});

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {headers.map((header) => (
              <TableCell key={header}>{formatPreviewCell(row[header])}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmptyExportState() {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Belum ada data kos.</CardTitle>
        <CardDescription>
          Tambahkan data terlebih dahulu sebelum mengekspor laporan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid min-h-72 place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
          <div className="max-w-md text-center">
            <Database
              className="mx-auto size-11 text-slate-400"
              aria-hidden="true"
            />
            <p className="mt-4 text-sm font-medium text-slate-900">
              Belum ada data kos. Tambahkan data terlebih dahulu sebelum
              mengekspor laporan.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Data mentah dan laporan analisis akan tersedia setelah minimal
              satu data kos aktif masuk ke dataset.
            </p>
            <Button asChild className="mt-5">
              <Link href="/input">
                <Plus className="size-4" aria-hidden="true" />
                Tambah Data Kos
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function downloadTextFile({
  content,
  fileName,
  mimeType,
}: Readonly<{
  content: string;
  fileName: string;
  mimeType: string;
}>) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getSuccessMessage(kind: ExportKind): string {
  const labels: Record<ExportKind, string> = {
    csv: DATA_CSV_FILE_NAME,
    html: REPORT_HTML_FILE_NAME,
    json: DATA_JSON_FILE_NAME,
    xlsx: DATA_XLSX_FILE_NAME,
  };

  return `${labels[kind]} berhasil dibuat.`;
}

function formatPreviewCell(value: ExportCellValue | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}
