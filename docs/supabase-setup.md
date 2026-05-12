# Supabase Setup

Milestone 2 uses Supabase Auth for credentials and Supabase PostgreSQL with Row
Level Security for authorization. Do not create password columns in public
tables.

## Environment Variables

Create `.env.local` from `.env.example`.

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-public-anon-or-publishable-key"
```

Newer Supabase projects may label the public browser-safe key as a
publishable key. The app also supports `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Never expose the service role key in browser code and never prefix it with
`NEXT_PUBLIC_`.

## Apply the Migration

Run the SQL in:

```text
supabase/migrations/202605120001_auth_database_foundation.sql
```

You can apply it with the Supabase SQL editor or the Supabase CLI after linking
the project.

## Create Users and Profiles

1. Create each user in Supabase Dashboard > Authentication > Users.
2. Keep password management inside Supabase Auth.
3. Insert a matching row in `public.profiles` for each Auth user id.

Example:

```sql
insert into public.profiles (id, full_name, role)
values
  ('00000000-0000-0000-0000-000000000000', 'Nama Admin', 'admin');
```

Valid roles are `admin`, `member`, and `viewer`.

The first admin profile should be inserted from the Supabase SQL editor or a
trusted admin context, because RLS requires an existing active admin before the
app can manage profiles.

## RLS Summary

- `profiles`: authenticated users can read themselves and active profiles;
  admins can insert, update, and delete profiles.
- `kos_data`: admins can read and manage all rows; members can insert and
  update their own rows while the dataset is not frozen; viewers can read
  non-deleted rows.
- `app_settings`: all active roles can read; admins can change settings.
- `audit_logs`: admins can read all logs; members can read their own logs;
  authenticated users can insert their own audit events.
- `dataset_snapshots`: all active roles can read snapshots; admins can create
  and manage snapshots.
- `report_exports`: admins can manage all export records; members can create
  their own export records; viewers can only read their own export records.
