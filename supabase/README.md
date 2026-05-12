# Supabase

Migration files live in `supabase/migrations`.

Milestone 2 adds the schema and Row Level Security foundation for:

- `profiles`
- `kos_data`
- `app_settings`
- `audit_logs`
- `dataset_snapshots`
- `report_exports`

Setup notes are in `docs/supabase-setup.md`.

Do not commit service role keys. Browser code may only use the public anon or
publishable key with Row Level Security enabled.
