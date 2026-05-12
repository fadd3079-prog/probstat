export type SupabasePublicConfig = Readonly<{
  url: string;
  anonKey: string;
}>;

export function getSupabasePublicConfig(): SupabasePublicConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function hasSupabasePublicConfig(
  config: SupabasePublicConfig = getSupabasePublicConfig()
): boolean {
  return config.url.length > 0 && config.anonKey.length > 0;
}
