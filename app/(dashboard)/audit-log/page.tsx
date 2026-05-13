import { History, ShieldAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchRecentAuditLogs } from "@/lib/audit/fetch-audit-logs";

export default async function AuditLogPage() {
  const { data: logs, error } = await fetchRecentAuditLogs();

  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Log Aktivitas
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Log Aktivitas
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Riwayat perubahan data yang dilakukan oleh pengguna.
            </p>
          </div>
          {!error ? (
            <Badge variant="outline" className="border-slate-300 text-slate-600">
              {logs.length} aktivitas terbaru
            </Badge>
          ) : null}
        </div>
      </section>

      {error ? (
        <section className="col-span-12">
          <Alert variant="destructive">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Log aktivitas gagal dimuat</AlertTitle>
            <AlertDescription>
              Data belum dapat dimuat. Coba muat ulang halaman atau hubungi
              admin jika masalah berlanjut.
            </AlertDescription>
          </Alert>
        </section>
      ) : null}

      {!error ? (
        <section className="col-span-12">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Log Terbaru</CardTitle>
                  <CardDescription>
                    Riwayat ini membantu menelusuri perubahan data penelitian.
                  </CardDescription>
                </div>
                <History className="size-5 text-slate-500" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Aktivitas</TableHead>
                    <TableHead>Objek</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Pengguna</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="h-28 text-center text-slate-500"
                        colSpan={6}
                      >
                        Belum ada aktivitas yang dapat ditampilkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs text-slate-600">
                          {formatDateTime(log.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-slate-200 text-slate-700"
                          >
                            {formatAuditAction(log.action)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatTableName(log.tableName)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {shorten(log.recordId)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {shorten(log.userId)}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.ipAddress ?? "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function shorten(value: string | null): string {
  if (!value) {
    return "-";
  }

  return value.length > 12 ? `${value.slice(0, 8)}...` : value;
}

function formatAuditAction(action: string): string {
  const labels: Record<string, string> = {
    "kos_data.create": "Menambahkan data kos",
    "kos_data.update": "Mengubah data kos",
    "kos_data.soft_delete": "Menghapus data dari dataset",
  };

  return labels[action] ?? action;
}

function formatTableName(tableName: string): string {
  const labels: Record<string, string> = {
    kos_data: "Data Kos",
    audit_logs: "Log Aktivitas",
  };

  return labels[tableName] ?? tableName;
}
