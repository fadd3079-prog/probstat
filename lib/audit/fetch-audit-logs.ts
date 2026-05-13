import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AuditLogRecord = Readonly<{
  id: string;
  userId: string | null;
  action: string;
  tableName: string;
  recordId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}>;

export type FetchAuditLogsResult = Readonly<{
  data: readonly AuditLogRecord[];
  error: string | null;
}>;

type AuditLogRow = Readonly<{
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}>;

export async function fetchRecentAuditLogs(
  limit = 50,
): Promise<FetchAuditLogsResult> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      data: [],
      error: "Konfigurasi aplikasi belum lengkap.",
    };
  }

  const { data, error } = await supabase
    .from("audit_logs")
    .select(
      "id, user_id, action, table_name, record_id, ip_address, user_agent, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      data: [],
      error: error.message,
    };
  }

  return {
    data: (data ?? []).map(mapAuditLogRow),
    error: null,
  };
}

function mapAuditLogRow(row: AuditLogRow): AuditLogRecord {
  return {
    id: row.id,
    userId: row.user_id,
    action: row.action,
    tableName: row.table_name,
    recordId: row.record_id,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    createdAt: row.created_at,
  };
}
