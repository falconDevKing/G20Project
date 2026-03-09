-- G20 onboarding v1 schema updates

alter table public.partner
  add column if not exists g20_active boolean not null default false,
  add column if not exists proposed_payment_scheduled boolean not null default false,
  add column if not exists married boolean,
  add column if not exists voluntary_participation boolean,
  add column if not exists attestation boolean,
  add column if not exists marriage_anniversary date,
  add column if not exists g20_category text,
  add column if not exists g20_amount bigint,
  add column if not exists motivation text;

create table if not exists public.proposed_payment_schedule (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.partner (id) on delete cascade,
  schedule_year int not null,
  schedule_index int not null,
  proposed_amount bigint not null,
  proposed_date date not null,
  unique_code text,
  organisation_id uuid,
  division_id uuid,
  chapter_id uuid,
  email text not null,
  first_name text not null,
  last_name text not null
);

create unique index if not exists uq_proposed_payment_schedule_user_year_idx
  on public.proposed_payment_schedule (user_id, schedule_year, schedule_index);

create index if not exists idx_proposed_payment_schedule_user_id
  on public.proposed_payment_schedule (user_id);

