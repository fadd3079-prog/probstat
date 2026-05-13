import { ClipboardCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PlaceholderPageProps = Readonly<{
  title: string;
  description: string;
  items: readonly string[];
}>;

export function PlaceholderPage({
  title,
  description,
  items,
}: PlaceholderPageProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <section className="col-span-12">
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </section>
      <section className="col-span-8">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Ruang Lingkup Halaman</CardTitle>
            <CardDescription>
              Bagian ini disiapkan untuk melengkapi analisis penelitian.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-700">
                  <ClipboardCheck
                    className="mt-0.5 size-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
