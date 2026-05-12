-- Kos Distance Analytics Dashboard
-- Milestone 2: Auth and database foundation
--
-- Passwords are intentionally absent from public tables. Supabase Auth owns
-- credential storage, password hashing, and session issuance.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'member'
    check (role in ('admin', 'member', 'viewer')),
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kos_data (
  id uuid primary key default gen_random_uuid(),
  nama_kos text not null,
  area text,
  jarak_meter integer not null check (jarak_meter > 0),
  google_maps_url text,
  mode_rute text not null default 'motor'
    check (mode_rute = 'motor'),
  titik_tujuan text not null default 'ATM BNI dekat gerbang FT Unsoed',
  metode_pengukuran text not null default 'Google Maps mode motor',
  catatan text,
  data_quality_status text not null default 'valid'
    check (
      data_quality_status in (
        'valid',
        'warning',
        'needs_review',
        'duplicate_suspected'
      )
    ),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  is_deleted boolean not null default false,
  deleted_at timestamptz,
  deleted_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  description text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.dataset_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_name text not null,
  description text,
  data jsonb not null,
  statistics jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.report_exports (
  id uuid primary key default gen_random_uuid(),
  export_type text not null
    check (export_type in ('csv', 'xlsx', 'pdf', 'docx', 'html', 'json')),
  file_name text not null,
  file_url text,
  export_metadata jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_is_active_idx on public.profiles(is_active);
create index if not exists kos_data_created_by_idx on public.kos_data(created_by);
create index if not exists kos_data_is_deleted_idx on public.kos_data(is_deleted);
create index if not exists kos_data_data_quality_status_idx
  on public.kos_data(data_quality_status);
create index if not exists audit_logs_user_id_idx on public.audit_logs(user_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at);
create index if not exists dataset_snapshots_created_by_idx
  on public.dataset_snapshots(created_by);
create index if not exists report_exports_created_by_idx
  on public.report_exports(created_by);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public, auth
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
    and p.is_active = true
  limit 1
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select public.current_user_role() = 'admin'
$$;

create or replace function public.dataset_is_frozen()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select (value ->> 'is_frozen')::boolean
      from public.app_settings
      where key = 'dataset_freeze'
      limit 1
    ),
    false
  )
$$;

create or replace function public.apply_kos_data_defaults()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by = coalesce(new.created_by, auth.uid());
  end if;

  new.updated_by = auth.uid();
  new.updated_at = now();

  if new.is_deleted = true and new.deleted_at is null then
    new.deleted_at = now();
  end if;

  if new.is_deleted = true and new.deleted_by is null then
    new.deleted_by = auth.uid();
  end if;

  return new;
end;
$$;

create or replace function public.apply_app_settings_defaults()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  new.updated_by = coalesce(new.updated_by, auth.uid());
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.apply_audit_log_defaults()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  new.user_id = coalesce(new.user_id, auth.uid());
  return new;
end;
$$;

create or replace function public.apply_created_by_default()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  new.created_by = coalesce(new.created_by, auth.uid());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists kos_data_apply_defaults on public.kos_data;
create trigger kos_data_apply_defaults
before insert or update on public.kos_data
for each row execute function public.apply_kos_data_defaults();

drop trigger if exists app_settings_apply_defaults on public.app_settings;
create trigger app_settings_apply_defaults
before insert or update on public.app_settings
for each row execute function public.apply_app_settings_defaults();

drop trigger if exists audit_logs_apply_defaults on public.audit_logs;
create trigger audit_logs_apply_defaults
before insert on public.audit_logs
for each row execute function public.apply_audit_log_defaults();

drop trigger if exists dataset_snapshots_apply_defaults on public.dataset_snapshots;
create trigger dataset_snapshots_apply_defaults
before insert on public.dataset_snapshots
for each row execute function public.apply_created_by_default();

drop trigger if exists report_exports_apply_defaults on public.report_exports;
create trigger report_exports_apply_defaults
before insert on public.report_exports
for each row execute function public.apply_created_by_default();

alter table public.profiles enable row level security;
alter table public.kos_data enable row level security;
alter table public.app_settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.dataset_snapshots enable row level security;
alter table public.report_exports enable row level security;

revoke all on public.profiles from anon;
revoke all on public.kos_data from anon;
revoke all on public.app_settings from anon;
revoke all on public.audit_logs from anon;
revoke all on public.dataset_snapshots from anon;
revoke all on public.report_exports from anon;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.kos_data to authenticated;
grant select, insert, update, delete on public.app_settings to authenticated;
grant select, insert on public.audit_logs to authenticated;
grant select, insert, update, delete on public.dataset_snapshots to authenticated;
grant select, insert, update, delete on public.report_exports to authenticated;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.apply_kos_data_defaults() from public, anon, authenticated;
revoke execute on function public.apply_app_settings_defaults() from public, anon, authenticated;
revoke execute on function public.apply_audit_log_defaults() from public, anon, authenticated;
revoke execute on function public.apply_created_by_default() from public, anon, authenticated;
revoke execute on function public.current_user_role() from public, anon;
revoke execute on function public.current_user_is_admin() from public, anon;
revoke execute on function public.dataset_is_frozen() from public, anon;

grant execute on function public.current_user_role() to authenticated;
grant execute on function public.current_user_is_admin() to authenticated;
grant execute on function public.dataset_is_frozen() to authenticated;

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (
  (select auth.uid()) is not null
  and (
    id = (select auth.uid())
    or public.current_user_is_admin()
    or is_active = true
  )
);

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin"
on public.profiles
for insert
to authenticated
with check (public.current_user_is_admin());

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin"
on public.profiles
for delete
to authenticated
using (public.current_user_is_admin());

drop policy if exists "kos_data_select_by_role" on public.kos_data;
create policy "kos_data_select_by_role"
on public.kos_data
for select
to authenticated
using (
  public.current_user_is_admin()
  or (
    public.current_user_role() in ('member', 'viewer')
    and is_deleted = false
  )
);

drop policy if exists "kos_data_insert_admin_member" on public.kos_data;
create policy "kos_data_insert_admin_member"
on public.kos_data
for insert
to authenticated
with check (
  public.current_user_role() in ('admin', 'member')
  and (public.current_user_is_admin() or public.dataset_is_frozen() = false)
  and created_by = (select auth.uid())
  and is_deleted = false
);

drop policy if exists "kos_data_update_admin" on public.kos_data;
create policy "kos_data_update_admin"
on public.kos_data
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "kos_data_update_own_member" on public.kos_data;
create policy "kos_data_update_own_member"
on public.kos_data
for update
to authenticated
using (
  public.current_user_role() = 'member'
  and created_by = (select auth.uid())
  and is_deleted = false
  and public.dataset_is_frozen() = false
)
with check (
  public.current_user_role() = 'member'
  and created_by = (select auth.uid())
  and public.dataset_is_frozen() = false
);

drop policy if exists "kos_data_delete_admin" on public.kos_data;
create policy "kos_data_delete_admin"
on public.kos_data
for delete
to authenticated
using (public.current_user_is_admin());

drop policy if exists "app_settings_select_authenticated" on public.app_settings;
create policy "app_settings_select_authenticated"
on public.app_settings
for select
to authenticated
using (public.current_user_role() in ('admin', 'member', 'viewer'));

drop policy if exists "app_settings_insert_admin" on public.app_settings;
create policy "app_settings_insert_admin"
on public.app_settings
for insert
to authenticated
with check (public.current_user_is_admin());

drop policy if exists "app_settings_update_admin" on public.app_settings;
create policy "app_settings_update_admin"
on public.app_settings
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "app_settings_delete_admin" on public.app_settings;
create policy "app_settings_delete_admin"
on public.app_settings
for delete
to authenticated
using (public.current_user_is_admin());

drop policy if exists "audit_logs_select_admin_member_own" on public.audit_logs;
create policy "audit_logs_select_admin_member_own"
on public.audit_logs
for select
to authenticated
using (
  public.current_user_is_admin()
  or (
    public.current_user_role() = 'member'
    and user_id = (select auth.uid())
  )
);

drop policy if exists "audit_logs_insert_own_authenticated" on public.audit_logs;
create policy "audit_logs_insert_own_authenticated"
on public.audit_logs
for insert
to authenticated
with check (
  public.current_user_role() in ('admin', 'member', 'viewer')
  and user_id = (select auth.uid())
);

drop policy if exists "dataset_snapshots_select_authenticated" on public.dataset_snapshots;
create policy "dataset_snapshots_select_authenticated"
on public.dataset_snapshots
for select
to authenticated
using (public.current_user_role() in ('admin', 'member', 'viewer'));

drop policy if exists "dataset_snapshots_insert_admin" on public.dataset_snapshots;
create policy "dataset_snapshots_insert_admin"
on public.dataset_snapshots
for insert
to authenticated
with check (
  public.current_user_is_admin()
  and created_by = (select auth.uid())
);

drop policy if exists "dataset_snapshots_update_admin" on public.dataset_snapshots;
create policy "dataset_snapshots_update_admin"
on public.dataset_snapshots
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "dataset_snapshots_delete_admin" on public.dataset_snapshots;
create policy "dataset_snapshots_delete_admin"
on public.dataset_snapshots
for delete
to authenticated
using (public.current_user_is_admin());

drop policy if exists "report_exports_select_by_role" on public.report_exports;
create policy "report_exports_select_by_role"
on public.report_exports
for select
to authenticated
using (
  public.current_user_is_admin()
  or created_by = (select auth.uid())
);

drop policy if exists "report_exports_insert_admin_member" on public.report_exports;
create policy "report_exports_insert_admin_member"
on public.report_exports
for insert
to authenticated
with check (
  public.current_user_role() in ('admin', 'member')
  and created_by = (select auth.uid())
);

drop policy if exists "report_exports_update_admin" on public.report_exports;
create policy "report_exports_update_admin"
on public.report_exports
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "report_exports_delete_admin" on public.report_exports;
create policy "report_exports_delete_admin"
on public.report_exports
for delete
to authenticated
using (public.current_user_is_admin());

insert into public.app_settings (key, value, description)
values
  (
    'methodology',
    jsonb_build_object(
      'research_title',
      'Jarak Kos-kosan Mahasiswa di Sekitar FT Unsoed ke Gerbang Kampus',
      'unit_observation',
      'kos-kosan',
      'main_variable',
      'jarak kos ke gerbang kampus dalam meter',
      'route_mode',
      'motor',
      'target_destination',
      'ATM BNI dekat gerbang FT Unsoed',
      'measurement_method',
      'Google Maps mode motor',
      'sampling_method',
      'purposive convenience sampling',
      'target_sample_size',
      30
    ),
    'Default methodology settings from the PRD.'
  ),
  (
    'dataset_freeze',
    jsonb_build_object(
      'is_frozen',
      false,
      'frozen_at',
      null,
      'frozen_by',
      null,
      'reason',
      null
    ),
    'Dataset freeze flag used to lock member edits before final reporting.'
  ),
  (
    'interval_settings',
    jsonb_build_object(
      'mode',
      'manual',
      'default_intervals',
      jsonb_build_array(
        jsonb_build_object('lower_bound', 0, 'upper_bound', 250, 'label', '0-250 m'),
        jsonb_build_object('lower_bound', 251, 'upper_bound', 500, 'label', '251-500 m'),
        jsonb_build_object('lower_bound', 501, 'upper_bound', 750, 'label', '501-750 m'),
        jsonb_build_object('lower_bound', 751, 'upper_bound', 1000, 'label', '751-1000 m'),
        jsonb_build_object('lower_bound', 1001, 'upper_bound', 1500, 'label', '1001-1500 m'),
        jsonb_build_object('lower_bound', 1501, 'upper_bound', 2000, 'label', '1501-2000 m'),
        jsonb_build_object('lower_bound', 2001, 'upper_bound', 3000, 'label', '2001-3000 m'),
        jsonb_build_object('lower_bound', 3001, 'upper_bound', 10000, 'label', '>3000 m')
      )
    ),
    'Default manual interval settings from the PRD.'
  )
on conflict (key) do nothing;
