import type { KosDataRecord } from "@/types/kos";
import type { UserRole } from "@/types/users";

export const userRoles = ["admin", "member", "viewer"] as const;

export function isUserRole(value: string | null | undefined): value is UserRole {
  return userRoles.includes(value as UserRole);
}

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function canReadDashboard(role: UserRole | null | undefined): boolean {
  return role === "admin" || role === "member" || role === "viewer";
}

export function canCreateKosData(role: UserRole | null | undefined): boolean {
  return role === "admin" || role === "member";
}

export function canUpdateKosData(
  role: UserRole | null | undefined,
  userId: string,
  record: Pick<KosDataRecord, "createdBy">
): boolean {
  return role === "admin" || (role === "member" && record.createdBy === userId);
}

export function canManageSettings(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

export function canViewAuditLogs(role: UserRole | null | undefined): boolean {
  return role === "admin" || role === "member";
}

export function formatUserRoleLabel(
  role: UserRole | null | undefined,
): string {
  const labels: Record<UserRole, string> = {
    admin: "Admin",
    member: "Anggota",
    viewer: "Pembaca",
  };

  return role ? labels[role] : "Tidak diketahui";
}
