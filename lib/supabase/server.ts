import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabasePublicConfig, hasSupabasePublicConfig } from "./config";
import type { Database } from "@/types/database";

export async function createClient(): Promise<SupabaseClient<Database> | null> {
  const config = getSupabasePublicConfig();

  if (!hasSupabasePublicConfig(config)) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.publicKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Proxy refreshes sessions.
        }
      },
    },
  });
}
