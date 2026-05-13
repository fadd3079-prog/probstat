"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig, hasSupabasePublicConfig } from "./config";
import type { Database } from "@/types/database";

let browserClient: SupabaseClient<Database> | null = null;

export function createClient(): SupabaseClient<Database> {
  if (browserClient) {
    return browserClient;
  }

  const config = getSupabasePublicConfig();

  if (!hasSupabasePublicConfig(config)) {
    throw new Error(
      "Browser client is not configured. Set the public application environment variables."
    );
  }

  browserClient = createBrowserClient<Database>(
    config.url,
    config.publicKey
  );

  return browserClient;
}
