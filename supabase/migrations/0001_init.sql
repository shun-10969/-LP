-- ============================================================
-- ミヤタアスリートクラブ — initial schema
-- Migrated from the localStorage-based prototype.
--
-- Design notes
-- - All public form submissions are inserted server-side through Next.js
--   API routes using the Supabase service-role key, so the browser never
--   touches the DB directly. RLS below is defense-in-depth.
-- - Staff authentication uses Supabase Auth (auth.users). A row in
--   public.staff marks which auth users are staff.
-- - Money is stored as integer yen (e.g. 6600), never display strings.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---- enums -------------------------------------------------
do $$ begin
  create type submission_category as enum
    ('trial','enrollment','coach','sponsor','withdrawal');
exception when duplicate_object then null; end $$;

do $$ begin
  create type enrollment_status as enum ('pending','active','cancelled');
exception when duplicate_object then null; end $$;

-- ============================================================
-- 1. trial_entries  — 体験・見学予約 (was miyata_entries)
-- ============================================================
create table if not exists public.trial_entries (
  id          uuid primary key default gen_random_uuid(),
  event_date  date        not null,           -- the requested visit date
  gakunen     text,                           -- 学年・区分 (小学1年生 … 一般)
  sei         text,                           -- 姓
  mei         text,                           -- 名
  furi_sei    text,                           -- セイ (optional)
  furi_mei    text,                           -- メイ (optional)
  tel         text,
  email       text,
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists trial_entries_event_date_idx on public.trial_entries (event_date);
create index if not exists trial_entries_created_at_idx  on public.trial_entries (created_at desc);

-- ============================================================
-- 2. enrollments — 入会/決済申込 (was miyata_payments)
--    Payment is a later phase; we persist the application now.
-- ============================================================
create table if not exists public.enrollments (
  id               uuid primary key default gen_random_uuid(),
  plan_name        text not null,             -- 低学年コース / 高学年コース / アスリート育成コース
  monthly_yen      integer not null,          -- 6600 / 9900
  first_month_yen  integer not null,          -- 11000 / 14300 (入会金込み)
  card_name        text,                      -- カード名義（保護者さま）only
  status           enrollment_status not null default 'pending',
  stripe_customer_id     text,                -- reserved for the payment phase
  stripe_subscription_id text,
  created_at       timestamptz not null default now()
);
create index if not exists enrollments_created_at_idx on public.enrollments (created_at desc);

-- ============================================================
-- 3. coach_applications — コーチ募集 (was miyata_coach)
-- ============================================================
create table if not exists public.coach_applications (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  age         text,                           -- free text in the prototype
  experience  text,
  contact     text,                           -- phone OR email
  motivation  text,
  created_at  timestamptz not null default now()
);
create index if not exists coach_applications_created_at_idx on public.coach_applications (created_at desc);

-- ============================================================
-- 4. sponsor_inquiries — スポンサー募集 (was miyata_sponsor)
-- ============================================================
create table if not exists public.sponsor_inquiries (
  id          uuid primary key default gen_random_uuid(),
  company     text,
  person      text,
  contact     text,
  message     text,
  created_at  timestamptz not null default now()
);
create index if not exists sponsor_inquiries_created_at_idx on public.sponsor_inquiries (created_at desc);

-- ============================================================
-- 5. withdrawals — 退会申請 (was miyata_withdraw)
-- ============================================================
create table if not exists public.withdrawals (
  id            uuid primary key default gen_random_uuid(),
  member_name   text,
  course        text,                         -- 低学年/高学年/アスリート育成コース
  desired_month text,                         -- 退会希望月 (free text e.g. 「７月末」)
  contact       text,
  reason        text,
  created_at    timestamptz not null default now()
);
create index if not exists withdrawals_created_at_idx on public.withdrawals (created_at desc);

-- ============================================================
-- 6. staff — links an auth user to staff access
-- ============================================================
create table if not exists public.staff (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at  timestamptz not null default now()
);

-- helper: is the current auth user a staff member?
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.staff s where s.user_id = auth.uid());
$$;

-- ============================================================
-- 7. admin_views — per-staff "last seen" per category (unread badges)
--    Replaces the localStorage miyata_viewed object.
-- ============================================================
create table if not exists public.admin_views (
  user_id     uuid not null references auth.users(id) on delete cascade,
  category    submission_category not null,
  last_seen_at timestamptz not null default now(),
  primary key (user_id, category)
);

-- ============================================================
-- RLS — deny by default; staff (authenticated) may read.
-- Inserts happen server-side via the service role, which bypasses RLS.
-- ============================================================
alter table public.trial_entries     enable row level security;
alter table public.enrollments        enable row level security;
alter table public.coach_applications enable row level security;
alter table public.sponsor_inquiries  enable row level security;
alter table public.withdrawals        enable row level security;
alter table public.staff              enable row level security;
alter table public.admin_views        enable row level security;

-- staff can read all submissions
do $$
declare t text;
begin
  foreach t in array array[
    'trial_entries','enrollments','coach_applications','sponsor_inquiries','withdrawals'
  ] loop
    execute format(
      'create policy %I on public.%I for select using (public.is_staff());',
      t||'_staff_select', t);
  end loop;
end $$;

-- staff table: a user can see their own staff row
create policy staff_self_select on public.staff
  for select using (user_id = auth.uid());

-- admin_views: a staff user manages only their own rows
create policy admin_views_self_all on public.admin_views
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
