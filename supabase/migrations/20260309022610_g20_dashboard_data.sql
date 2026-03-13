-- G20 dashboard data model updates

alter table public.partner
  add column if not exists g20_subscription_ids jsonb not null default '[]'::jsonb;

create table if not exists public.g20_payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  user_id uuid not null,
  organisation_id uuid null,
  division_id uuid null,
  chapter_id uuid null,

  unique_code text null,
  email text not null,
  first_name text not null,
  last_name text not null,

  payment_date date not null,
  amount bigint not null check (amount > 0),
  currency text not null default 'NGN',
  status text not null default 'Pending',

  payment_channel text null,
  payment_reference text null,
  receipt_url text null,
  notes text null,
  metadata jsonb not null default '{}'::jsonb,

  approved_by text null,
  approved_by_id uuid null,
  approved_by_image text null
);

create index if not exists idx_g20_payments_user_payment_date_desc
  on public.g20_payments (user_id, payment_date desc);

create index if not exists idx_g20_payments_org_payment_date_desc
  on public.g20_payments (organisation_id, payment_date desc);

create index if not exists idx_g20_payments_div_payment_date_desc
  on public.g20_payments (division_id, payment_date desc);

create index if not exists idx_g20_payments_chapter_payment_date_desc
  on public.g20_payments (chapter_id, payment_date desc);

create index if not exists idx_g20_payments_status
  on public.g20_payments (status);

create index if not exists idx_g20_payments_reference
  on public.g20_payments (payment_reference);
