import { AlertCircle, GraduationCap } from "lucide-react";
import { login } from "./actions";
import { LoginSubmitButton } from "@/components/auth/LoginSubmitButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
}>;

const errorMessages: Record<string, string> = {
  invalid: "Email atau kata sandi tidak sesuai.",
  required: "Email dan kata sandi wajib diisi.",
  missing_config:
    "Konfigurasi aplikasi belum lengkap. Hubungi admin aplikasi.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error ? errorMessages[params.error] : null;
  const nextPath =
    params?.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <GraduationCap className="size-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              Akses Dashboard
            </Badge>
            <CardTitle>Masuk Dashboard</CardTitle>
            <CardDescription>
              Masuk menggunakan akun yang telah terdaftar untuk anggota
              kelompok.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {errorMessage ? (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="size-4" aria-hidden="true" />
              <AlertTitle>Masuk gagal</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <form action={login} className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@contoh.ac.id"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                name="remember"
                type="checkbox"
                defaultChecked
                className="size-4 rounded border-slate-300"
              />
              Ingat saya di perangkat ini
            </label>

            <LoginSubmitButton />
          </form>

          <p className="text-xs leading-5 text-slate-500">
            Kata sandi dikelola secara aman dan tidak ditampilkan di
            dashboard.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
