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
            Konfigurasi diperlukan
          </Badge>
          <CardTitle>Konfigurasi aplikasi belum lengkap</CardTitle>
          <CardDescription>
            Aplikasi belum dapat memverifikasi akses pengguna. Hubungi admin
            aplikasi agar dashboard dapat digunakan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-amber-200 bg-amber-50">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Aplikasi belum siap digunakan.</AlertTitle>
            <AlertDescription>
              Pengaturan akses perlu dilengkapi oleh admin proyek.
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
            Akses diperlukan
          </Badge>
          <CardTitle>
            {status === "missing_profile"
              ? "Akun belum terdaftar"
              : "Akses akun tidak aktif"}
          </CardTitle>
          <CardDescription>
            Akun Anda belum memiliki akses aktif ke dashboard penelitian ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-slate-200 bg-slate-50">
            <ShieldAlert className="size-4" aria-hidden="true" />
            <AlertTitle>Hubungi admin proyek.</AlertTitle>
            <AlertDescription>
              Admin perlu meninjau dan mengaktifkan akses akun Anda.
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
