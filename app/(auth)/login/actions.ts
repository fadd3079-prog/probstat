"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getSafeNextPath(value: FormDataEntryValue | null): string {
  const nextPath = typeof value === "string" ? value : "";

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  if (nextPath.startsWith("/login")) {
    return "/dashboard";
  }

  return nextPath;
}

function redirectToLogin(error: string, nextPath: string): never {
  const params = new URLSearchParams({ error });

  if (nextPath !== "/dashboard") {
    params.set("next", nextPath);
  }

  redirect(`/login?${params.toString()}`);
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeNextPath(formData.get("next"));

  if (!email || !password) {
    redirectToLogin("required", nextPath);
  }

  const supabase = await createClient();

  if (!supabase) {
    redirectToLogin("missing_config", nextPath);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectToLogin("invalid", nextPath);
  }

  redirect(nextPath);
}
