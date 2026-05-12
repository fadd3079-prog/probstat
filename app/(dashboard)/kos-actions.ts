"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { canCreateKosData } from "@/lib/auth/roles";
import { MEASUREMENT_METHOD, ROUTE_MODE, TARGET_DESTINATION } from "@/lib/constants";
import type { KosCrudActionState } from "@/lib/kos/action-state";
import { normalizeAreaName, normalizeKosName } from "@/lib/kos/normalize-text";
import { kosDataFormSchema, kosRecordIdSchema } from "@/lib/kos/validation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { DataQualityStatus } from "@/types/kos";
import type { KosDataFormValues } from "@/lib/kos/validation";
import type { UserProfile, UserRole } from "@/types/users";

type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;
type KosDataRow = Database["public"]["Tables"]["kos_data"]["Row"];

type ActionContext = Readonly<{
  supabase: SupabaseServerClient;
  profile: Pick<UserProfile, "id" | "role" | "isActive">;
}>;

type ActionContextResult =
  | Readonly<{ context: ActionContext; error: null }>
  | Readonly<{ context: null; error: KosCrudActionState }>;

export async function createKosDataAction(
  _previousState: KosCrudActionState,
  formData: FormData,
): Promise<KosCrudActionState> {
  const contextResult = await getActionContext();

  if (contextResult.error) {
    return contextResult.error;
  }

  const { profile, supabase } = contextResult.context;

  if (!canCreateKosData(profile.role)) {
    return {
      status: "error",
      message: "Role viewer tidak dapat menambah data kos.",
    };
  }

  const parsed = kosDataFormSchema.safeParse(formDataToKosValues(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Data belum valid. Periksa kembali field yang ditandai.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: formDataToKosValues(formData),
    };
  }

  const dataQualityStatus = await getKosDataQualityStatus(
    supabase,
    parsed.data.namaKos,
  );

  if (dataQualityStatus.status === null) {
    return {
      status: "error",
      message: dataQualityStatus.error,
      values: parsed.data,
    };
  }

  const payload = toKosDataInsertPayload(
    parsed.data,
    profile.id,
    dataQualityStatus.status,
  );
  const { data: insertedRow, error: insertError } = await supabase
    .from("kos_data")
    .insert(payload)
    .select(
      "id, nama_kos, area, jarak_meter, google_maps_url, mode_rute, titik_tujuan, metode_pengukuran, catatan, data_quality_status, created_by, updated_by, is_deleted, deleted_at, deleted_by, created_at, updated_at",
    )
    .single();

  if (insertError || !insertedRow) {
    return {
      status: "error",
      message: toFriendlyDatabaseError(
        insertError?.message,
        "Data kos gagal dibuat.",
      ),
      values: parsed.data,
    };
  }

  const auditWarning = await writeAuditLog(supabase, {
    userId: profile.id,
    action: "kos_data.create",
    recordId: insertedRow.id,
    oldData: null,
    newData: toAuditKosData(insertedRow),
  });

  revalidateCrudPaths();

  return {
    status: "success",
    message: auditWarning
      ? `Data kos berhasil dibuat. ${auditWarning}`
      : "Data kos berhasil dibuat dan tercatat di audit log.",
  };
}

export async function updateKosDataAction(
  _previousState: KosCrudActionState,
  formData: FormData,
): Promise<KosCrudActionState> {
  const contextResult = await getActionContext();

  if (contextResult.error) {
    return contextResult.error;
  }

  const { profile, supabase } = contextResult.context;
  const idResult = kosRecordIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!idResult.success) {
    return {
      status: "error",
      message: "ID data kos tidak valid.",
      fieldErrors: idResult.error.flatten().fieldErrors,
      values: formDataToKosValues(formData),
    };
  }

  const parsed = kosDataFormSchema.safeParse(formDataToKosValues(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Data belum valid. Periksa kembali field yang ditandai.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: formDataToKosValues(formData),
    };
  }

  const { data: existingRow, error: existingError } = await supabase
    .from("kos_data")
    .select(
      "id, nama_kos, area, jarak_meter, google_maps_url, mode_rute, titik_tujuan, metode_pengukuran, catatan, data_quality_status, created_by, updated_by, is_deleted, deleted_at, deleted_by, created_at, updated_at",
    )
    .eq("id", idResult.data.id)
    .eq("is_deleted", false)
    .maybeSingle();

  if (existingError || !existingRow) {
    return {
      status: "error",
      message: toFriendlyDatabaseError(
        existingError?.message,
        "Data kos tidak ditemukan atau tidak dapat diakses.",
      ),
      values: parsed.data,
    };
  }

  if (!canMutateRecord(profile.role, profile.id, existingRow)) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk mengedit data kos ini.",
      values: parsed.data,
    };
  }

  const dataQualityStatus = await getKosDataQualityStatus(
    supabase,
    parsed.data.namaKos,
    idResult.data.id,
  );

  if (dataQualityStatus.status === null) {
    return {
      status: "error",
      message: dataQualityStatus.error,
      values: parsed.data,
    };
  }

  const { data: updatedRow, error: updateError } = await supabase
    .from("kos_data")
    .update(
      toKosDataUpdatePayload(
        parsed.data,
        profile.id,
        dataQualityStatus.status,
      ),
    )
    .eq("id", idResult.data.id)
    .eq("is_deleted", false)
    .select(
      "id, nama_kos, area, jarak_meter, google_maps_url, mode_rute, titik_tujuan, metode_pengukuran, catatan, data_quality_status, created_by, updated_by, is_deleted, deleted_at, deleted_by, created_at, updated_at",
    )
    .single();

  if (updateError || !updatedRow) {
    return {
      status: "error",
      message: toFriendlyDatabaseError(
        updateError?.message,
        "Data kos gagal diperbarui.",
      ),
      values: parsed.data,
    };
  }

  const auditWarning = await writeAuditLog(supabase, {
    userId: profile.id,
    action: "kos_data.update",
    recordId: updatedRow.id,
    oldData: toAuditKosData(existingRow),
    newData: toAuditKosData(updatedRow),
  });

  revalidateCrudPaths();

  return {
    status: "success",
    message: auditWarning
      ? `Data kos berhasil diperbarui. ${auditWarning}`
      : "Data kos berhasil diperbarui dan tercatat di audit log.",
  };
}

export async function softDeleteKosDataAction(
  _previousState: KosCrudActionState,
  formData: FormData,
): Promise<KosCrudActionState> {
  const contextResult = await getActionContext();

  if (contextResult.error) {
    return contextResult.error;
  }

  const { profile, supabase } = contextResult.context;
  const idResult = kosRecordIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!idResult.success) {
    return {
      status: "error",
      message: "ID data kos tidak valid.",
      fieldErrors: idResult.error.flatten().fieldErrors,
    };
  }

  const { data: existingRow, error: existingError } = await supabase
    .from("kos_data")
    .select(
      "id, nama_kos, area, jarak_meter, google_maps_url, mode_rute, titik_tujuan, metode_pengukuran, catatan, data_quality_status, created_by, updated_by, is_deleted, deleted_at, deleted_by, created_at, updated_at",
    )
    .eq("id", idResult.data.id)
    .eq("is_deleted", false)
    .maybeSingle();

  if (existingError || !existingRow) {
    return {
      status: "error",
      message: toFriendlyDatabaseError(
        existingError?.message,
        "Data kos tidak ditemukan atau tidak dapat diakses.",
      ),
    };
  }

  if (!canMutateRecord(profile.role, profile.id, existingRow)) {
    return {
      status: "error",
      message: "Anda tidak memiliki izin untuk menghapus data kos ini.",
    };
  }

  const { data: deletedRow, error: deleteError } = await supabase
    .from("kos_data")
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      deleted_by: profile.id,
      updated_by: profile.id,
    })
    .eq("id", idResult.data.id)
    .eq("is_deleted", false)
    .select(
      "id, nama_kos, area, jarak_meter, google_maps_url, mode_rute, titik_tujuan, metode_pengukuran, catatan, data_quality_status, created_by, updated_by, is_deleted, deleted_at, deleted_by, created_at, updated_at",
    )
    .single();

  if (deleteError || !deletedRow) {
    return {
      status: "error",
      message: toFriendlyDatabaseError(
        deleteError?.message,
        "Data kos gagal dihapus.",
      ),
    };
  }

  const auditWarning = await writeAuditLog(supabase, {
    userId: profile.id,
    action: "kos_data.soft_delete",
    recordId: deletedRow.id,
    oldData: toAuditKosData(existingRow),
    newData: toAuditKosData(deletedRow),
  });

  revalidateCrudPaths();

  return {
    status: "success",
    message: auditWarning
      ? `Data kos berhasil dihapus secara soft delete. ${auditWarning}`
      : "Data kos berhasil dihapus secara soft delete dan tercatat di audit log.",
  };
}

async function getActionContext(): Promise<ActionContextResult> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      context: null,
      error: {
        status: "error",
        message:
          "Supabase belum dikonfigurasi. Pastikan environment variables production sudah diisi di Vercel.",
      },
    };
  }

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return {
      context: null,
      error: {
        status: "error",
        message: "Sesi login tidak valid. Silakan login ulang dari website.",
      },
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      context: null,
      error: {
        status: "error",
        message:
          "Profile aplikasi tidak ditemukan. Admin perlu membuat profile untuk user ini.",
      },
    };
  }

  if (!profile.is_active) {
    return {
      context: null,
      error: {
        status: "error",
        message: "Profile aplikasi tidak aktif. Hubungi admin proyek.",
      },
    };
  }

  return {
    context: {
      supabase,
      profile: {
        id: profile.id,
        role: profile.role,
        isActive: profile.is_active,
      },
    },
    error: null,
  };
}

function formDataToKosValues(formData: FormData): KosDataFormValues {
  const normalizedArea = normalizeAreaName(String(formData.get("area") ?? ""));

  return {
    namaKos: normalizeKosName(String(formData.get("namaKos") ?? "")),
    area: normalizedArea ?? "",
    jarakMeter: Number(formData.get("jarakMeter") ?? Number.NaN),
    googleMapsUrl: String(formData.get("googleMapsUrl") ?? ""),
    catatan: String(formData.get("catatan") ?? ""),
  };
}

function toNullableText(value: string): string | null {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function toKosDataInsertPayload(
  values: KosDataFormValues,
  userId: string,
  dataQualityStatus: DataQualityStatus = "valid",
): Database["public"]["Tables"]["kos_data"]["Insert"] {
  return {
    nama_kos: values.namaKos,
    area: toNullableText(values.area),
    jarak_meter: values.jarakMeter,
    google_maps_url: toNullableText(values.googleMapsUrl),
    mode_rute: ROUTE_MODE,
    titik_tujuan: TARGET_DESTINATION,
    metode_pengukuran: MEASUREMENT_METHOD,
    catatan: toNullableText(values.catatan),
    data_quality_status: dataQualityStatus,
    created_by: userId,
    updated_by: userId,
    is_deleted: false,
  };
}

function toKosDataUpdatePayload(
  values: KosDataFormValues,
  userId: string,
  dataQualityStatus: DataQualityStatus = "valid",
): Database["public"]["Tables"]["kos_data"]["Update"] {
  return {
    nama_kos: values.namaKos,
    area: toNullableText(values.area),
    jarak_meter: values.jarakMeter,
    google_maps_url: toNullableText(values.googleMapsUrl),
    catatan: toNullableText(values.catatan),
    mode_rute: ROUTE_MODE,
    titik_tujuan: TARGET_DESTINATION,
    metode_pengukuran: MEASUREMENT_METHOD,
    data_quality_status: dataQualityStatus,
    updated_by: userId,
  };
}

type KosDataQualityStatusResult = Readonly<
  | {
      status: DataQualityStatus;
      error: null;
    }
  | {
      status: null;
      error: string;
    }
>;

async function getKosDataQualityStatus(
  supabase: SupabaseServerClient,
  normalizedKosName: string,
  currentRecordId?: string,
): Promise<KosDataQualityStatusResult> {
  const { data, error } = await supabase
    .from("kos_data")
    .select("id, nama_kos")
    .eq("is_deleted", false);

  if (error) {
    return {
      status: null,
      error: `Gagal memeriksa duplikasi nama kos. ${error.message}`,
    };
  }

  const hasDuplicate = (data ?? []).some((record) => {
    if (record.id === currentRecordId) {
      return false;
    }

    return normalizeKosName(record.nama_kos) === normalizedKosName;
  });

  return {
    status: hasDuplicate ? "duplicate_suspected" : "valid",
    error: null,
  };
}

function canMutateRecord(
  role: UserRole,
  userId: string,
  record: Pick<KosDataRow, "created_by">,
): boolean {
  return role === "admin" || (role === "member" && record.created_by === userId);
}

function toAuditKosData(row: KosDataRow) {
  return {
    id: row.id,
    nama_kos: row.nama_kos,
    area: row.area,
    jarak_meter: row.jarak_meter,
    google_maps_url: row.google_maps_url,
    mode_rute: row.mode_rute,
    titik_tujuan: row.titik_tujuan,
    metode_pengukuran: row.metode_pengukuran,
    catatan: row.catatan,
    data_quality_status: row.data_quality_status,
    created_by: row.created_by,
    updated_by: row.updated_by,
    is_deleted: row.is_deleted,
    deleted_at: row.deleted_at,
    deleted_by: row.deleted_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

type AuditInput = Readonly<{
  userId: string;
  action: string;
  recordId: string;
  oldData: ReturnType<typeof toAuditKosData> | null;
  newData: ReturnType<typeof toAuditKosData> | null;
}>;

async function writeAuditLog(
  supabase: SupabaseServerClient,
  input: AuditInput,
): Promise<string | null> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const userAgent = requestHeaders.get("user-agent");
  const { error } = await supabase.from("audit_logs").insert({
    user_id: input.userId,
    action: input.action,
    table_name: "kos_data",
    record_id: input.recordId,
    old_data: input.oldData,
    new_data: input.newData,
    ip_address: forwardedFor?.split(",")[0]?.trim() ?? null,
    user_agent: userAgent,
  });

  if (!error) {
    return null;
  }

  return `Namun audit log gagal dicatat: ${error.message}`;
}

function revalidateCrudPaths() {
  revalidatePath("/input");
  revalidatePath("/data-kos");
  revalidatePath("/dashboard");
  revalidatePath("/statistik");
  revalidatePath("/audit-log");
}

function toFriendlyDatabaseError(
  message: string | undefined,
  fallback: string,
): string {
  if (!message) {
    return fallback;
  }

  if (message.toLowerCase().includes("row-level security")) {
    return `${fallback} Akses ditolak oleh RLS Supabase. Pastikan role user sesuai.`;
  }

  return `${fallback} ${message}`;
}
