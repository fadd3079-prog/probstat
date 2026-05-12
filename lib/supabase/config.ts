export type SupabasePublicConfig = Readonly<{
  url: string;
  publicKey: string;
}>;

export function getSupabasePublicConfig(): SupabasePublicConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    publicKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "",
  };
}

export function hasSupabasePublicConfig(
  config: SupabasePublicConfig = getSupabasePublicConfig()
): boolean {
  return config.url.length > 0 && config.publicKey.length > 0;
}
