import type { ReactNode } from "react";
import { Monitor } from "lucide-react";

type DesktopOnlyWarningProps = Readonly<{
  children: ReactNode;
}>;

export function DesktopOnlyWarning({ children }: DesktopOnlyWarningProps) {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8 min-[1366px]:hidden">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex size-11 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Monitor className="size-5" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-slate-950">
            Aplikasi ini dirancang untuk desktop.
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Silakan buka melalui laptop atau komputer agar dashboard tampil
            optimal.
          </p>
        </div>
      </div>
      <div className="hidden min-h-screen min-[1366px]:block">{children}</div>
    </>
  );
}
