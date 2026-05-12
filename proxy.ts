import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/input/:path*",
    "/data-kos/:path*",
    "/statistik/:path*",
    "/distribusi/:path*",
    "/normalitas/:path*",
    "/visualisasi/:path*",
    "/export/:path*",
    "/audit-log/:path*",
    "/settings/:path*",
  ],
};
