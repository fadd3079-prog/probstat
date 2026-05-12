export type UserRole = "admin" | "member" | "viewer";

export type UserProfile = Readonly<{
  id: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}>;
