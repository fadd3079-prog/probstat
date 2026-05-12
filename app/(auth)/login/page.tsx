import { AlertCircle, GraduationCap } from "lucide-react";
import { login } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  invalid: "Email atau password tidak sesuai.",
  required: "Email dan password wajib diisi.",
  missing_config:
    "Supabase belum dikonfigurasi. Isi environment variables sebelum login.",
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
              Supabase Auth
            </Badge>
            <CardTitle>Login Dashboard</CardTitle>
            <CardDescription>
              Masuk menggunakan akun Supabase Auth yang dibuat untuk anggota
              kelompok.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {errorMessage ? (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="size-4" aria-hidden="true" />
              <AlertTitle>Login gagal</AlertTitle>
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
              <Label htmlFor="password">Password</Label>
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
              Ingat sesi di browser ini
            </label>

            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </form>

          <p className="text-xs leading-5 text-slate-500">
            Password tidak disimpan di tabel publik. Kredensial dikelola oleh
            Supabase Auth, sedangkan role aplikasi disimpan di tabel
            <span className="font-mono"> profiles</span>.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
