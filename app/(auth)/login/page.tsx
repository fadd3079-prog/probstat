import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
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
              Autentikasi email dan password disiapkan pada Milestone 2.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            Placeholder route untuk halaman login. Data dashboard tetap harus
            dilindungi dengan Supabase Auth dan RLS pada implementasi berikutnya.
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
