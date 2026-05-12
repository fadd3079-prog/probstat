import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardAuthState } from "@/lib/auth/session";

function AuthSetupCard() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-8">
      <Card className="w-full max-w-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <Badge variant="outline" className="w-fit border-amber-200 text-amber-700">
            Supabase setup required
          </Badge>
          <CardTitle>Environment Supabase belum dikonfigurasi</CardTitle>
          <CardDescription>
            Dashboard route sudah disiapkan untuk proteksi Supabase Auth, tetapi
            perlu URL dan public anon/publishable key untuk memverifikasi sesi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-amber-200 bg-amber-50">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Isi `.env.local` sebelum mencoba login.</AlertTitle>
            <AlertDescription>
              Gunakan `.env.example` sebagai acuan. Jangan menaruh service role
              key di environment yang diawali `NEXT_PUBLIC_`.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </main>
  );
}

function ProfileRequiredCard({
  status,
}: Readonly<{
  status: "missing_profile" | "inactive_profile";
}>) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-8">
      <Card className="w-full max-w-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <Badge variant="outline" className="w-fit border-slate-200 text-slate-600">
            Profile required
          </Badge>
          <CardTitle>
            {status === "missing_profile"
              ? "Profile aplikasi belum dibuat"
              : "Profile aplikasi tidak aktif"}
          </CardTitle>
          <CardDescription>
            Supabase Auth berhasil mengenali user, tetapi akses dashboard tetap
            membutuhkan profile aktif dengan role admin, member, atau viewer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-slate-200 bg-slate-50">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Hubungi admin proyek.</AlertTitle>
            <AlertDescription>
              Admin perlu membuat atau mengaktifkan baris pada tabel
              <span className="font-mono"> public.profiles</span> untuk user
              ini.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </main>
  );
}

export default async function ProtectedDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const authState = await getDashboardAuthState();

  if (authState.status === "missing_config") {
    return <AuthSetupCard />;
  }

  if (authState.status === "unauthenticated") {
    redirect("/login");
  }

  if (authState.status === "missing_profile") {
    return <ProfileRequiredCard status="missing_profile" />;
  }

  if (authState.status === "inactive_profile") {
    return <ProfileRequiredCard status="inactive_profile" />;
  }

  return (
    <DashboardShell profile={authState.profile} email={authState.email}>
      {children}
    </DashboardShell>
  );
}
