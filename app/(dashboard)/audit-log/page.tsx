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
            <p className="text-sm font-medium text-slate-500">Audit Log</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Riwayat Aktivitas Data
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Log ini membantu memverifikasi bahwa create, update, dan soft
              delete data kos dilakukan dari dashboard web dengan sesi user yang
              login.
            </p>
          </div>
          <Badge variant="outline" className="border-slate-300 text-slate-600">
            {logs.length} log terbaru
          </Badge>
        </div>
      </section>

      {error ? (
        <section className="col-span-12">
          <Alert variant="destructive">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Audit log gagal dimuat</AlertTitle>
            <AlertDescription>
              {error}. Akses audit mengikuti RLS: admin melihat semua log,
              member melihat log miliknya, viewer tidak memiliki akses audit.
            </AlertDescription>
          </Alert>
        </section>
      ) : null}

      <section className="col-span-12">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Log Terbaru</CardTitle>
                <CardDescription>
                  Data audit berasal dari tabel public.audit_logs dan dibatasi
                  oleh policy Supabase RLS.
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
                  <TableHead>Action</TableHead>
                  <TableHead>Tabel</TableHead>
                  <TableHead>Record</TableHead>
                  <TableHead>User</TableHead>
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
                      Belum ada audit log yang dapat ditampilkan untuk user ini.
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
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.tableName}</TableCell>
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
