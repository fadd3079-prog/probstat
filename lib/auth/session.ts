import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types/users";

type MissingConfigAuthState = Readonly<{
  status: "missing_config";
}>;

type UnauthenticatedAuthState = Readonly<{
  status: "unauthenticated";
}>;

type MissingProfileAuthState = Readonly<{
  status: "missing_profile";
  userId: string;
  email: string | null;
}>;

type InactiveProfileAuthState = Readonly<{
  status: "inactive_profile";
  profile: UserProfile;
  email: string | null;
}>;

type AuthenticatedAuthState = Readonly<{
  status: "authenticated";
  profile: UserProfile;
  email: string | null;
}>;

export type DashboardAuthState =
  | MissingConfigAuthState
  | UnauthenticatedAuthState
  | MissingProfileAuthState
  | InactiveProfileAuthState
  | AuthenticatedAuthState;

type ProfileRow = Readonly<{
  id: string;
  full_name: string;
  role: UserProfile["role"];
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}>;

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    role: row.role,
    avatarUrl: row.avatar_url,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getDashboardAuthState(): Promise<DashboardAuthState> {
  const supabase = await createClient();

  if (!supabase) {
    return { status: "missing_config" };
  }

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return { status: "unauthenticated" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url, is_active, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    return {
      status: "missing_profile",
      userId,
      email: user?.email ?? null,
    };
  }

  const mappedProfile = mapProfile(profile);

  if (!mappedProfile.isActive) {
    return {
      status: "inactive_profile",
      profile: mappedProfile,
      email: user?.email ?? null,
    };
  }

  return {
    status: "authenticated",
    profile: mappedProfile,
    email: user?.email ?? null,
  };
}
