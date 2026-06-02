import type {
  ExportCellValue,
  ExportTableRow,
  ReportExportData,
} from "@/lib/report/generate-report-data";

export function createHtmlReport(reportData: ReportExportData): string {
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(reportData.title)}</title>
  <style>
    body {
      margin: 0;
      background: #f8fafc;
      color: #0f172a;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    main {
      width: 960px;
      margin: 0 auto;
      padding: 40px 32px;
      background: #ffffff;
    }
    h1, h2, h3 {
      margin: 0;
      line-height: 1.25;
    }
    h1 {
      font-size: 28px;
    }
    h2 {
      margin-top: 32px;
      font-size: 20px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
    }
    h3 {
      margin-top: 20px;
      font-size: 16px;
    }
    p {
      margin: 8px 0 0;
    }
    .muted {
      color: #475569;
      font-size: 14px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .box {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      background: #f8fafc;
    }
    .label {
      color: #64748b;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .value {
      margin-top: 4px;
      color: #0f172a;
      font-size: 14px;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 8px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-size: 12px;
      text-transform: uppercase;
    }
    .conclusion {
      margin-top: 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #f8fafc;
      padding: 14px;
    }
    @media print {
      body {
        background: #ffffff;
      }
      main {
        width: auto;
        padding: 24px;
      }
      h2 {
        break-after: avoid;
      }
      table {
        break-inside: auto;
      }
      tr {
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <main>
    <h1>${escapeHtml(reportData.title)}</h1>
    <p class="muted">${escapeHtml(reportData.subtitle)}</p>
    <p class="muted">Dibuat pada ${escapeHtml(reportData.generatedAtLabel)}</p>

    <h2>Anggota Kelompok</h2>
    ${renderTable(
      reportData.members.map((member) => ({
        No: member.no,
        Nama: member.name,
        NIM: member.nim,
      })),
      "Belum ada data anggota.",
    )}

    <h2>Metode Penelitian</h2>
    <div class="grid">
      ${renderInfoBox("Metode Pengumpulan Data", reportData.methodology.metodePengumpulanData)}
      ${renderInfoBox("Unit Observasi", reportData.methodology.unitObservasi)}
      ${renderInfoBox("Variabel Utama", reportData.methodology.variabelUtama)}
      ${renderInfoBox("Mode Rute", reportData.methodology.modeRute)}
      ${renderInfoBox("Titik Tujuan", reportData.methodology.titikTujuan)}
      ${renderInfoBox("Metode Sampling", reportData.methodology.metodeSampling)}
    </div>

    <h2>Data Kos</h2>
    <p class="muted">Jumlah data aktif: ${escapeHtml(String(reportData.rowCount))} kos.</p>
    ${renderTable(reportData.rawDataRows, "Belum ada data kos.")}

    <h2>Statistik Deskriptif</h2>
    ${renderTable(reportData.descriptiveRows, "Statistik deskriptif belum tersedia.")}

    <h2>Distribusi Frekuensi</h2>
    <p class="muted">${escapeHtml(reportData.frequencyInterpretation)}</p>
    ${renderTable(reportData.frequencyRows, "Distribusi frekuensi belum tersedia.")}

    <h2>Uji Normalitas</h2>
    <p class="muted">${escapeHtml(reportData.normalityInterpretation)}</p>
    ${renderTable(reportData.normalitySummaryRows, "Ringkasan uji normalitas belum tersedia.")}
    <h3>Tabel Detail Uji Normalitas</h3>
    ${renderTable(reportData.normalityRows, "Tabel detail uji normalitas belum tersedia.")}

    <h2>Kesimpulan Singkat</h2>
    <div class="conclusion">${escapeHtml(reportData.conclusion)}</div>
  </main>
</body>
</html>`;
}

function renderInfoBox(label: string, value: string): string {
  return `<div class="box"><div class="label">${escapeHtml(
    label,
  )}</div><div class="value">${escapeHtml(value)}</div></div>`;
}

function renderTable(
  rows: readonly ExportTableRow[],
  emptyMessage: string,
): string {
  if (rows.length === 0) {
    return `<p class="muted">${escapeHtml(emptyMessage)}</p>`;
  }

  const headers = Object.keys(rows[0] ?? {});
  const headerHtml = headers
    .map((header) => `<th>${escapeHtml(header)}</th>`)
    .join("");
  const bodyHtml = rows
    .map(
      (row) =>
        `<tr>${headers
          .map((header) => `<td>${formatCell(row[header])}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
}

function formatCell(value: ExportCellValue | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return escapeHtml(String(value));
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
