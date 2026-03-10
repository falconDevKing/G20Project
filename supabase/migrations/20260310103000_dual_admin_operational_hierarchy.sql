-- Operational hierarchy tables
create table if not exists public.hos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz null default now(),
  updated_at timestamptz null default now(),
  name text not null,
  organisation_id uuid not null references public.organisation(id) on delete restrict,
  rep_partner_id uuid null references public.partner(id) on delete set null,
  reps jsonb null default '[]'::jsonb
);

create table if not exists public.governor (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz null default now(),
  updated_at timestamptz null default now(),
  name text not null,
  organisation_id uuid not null references public.organisation(id) on delete restrict,
  hos_id uuid not null references public.hos(id) on delete restrict,
  rep_partner_id uuid null references public.partner(id) on delete set null,
  reps jsonb null default '[]'::jsonb
);

create table if not exists public.president (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz null default now(),
  updated_at timestamptz null default now(),
  name text not null,
  organisation_id uuid not null references public.organisation(id) on delete restrict,
  hos_id uuid not null references public.hos(id) on delete restrict,
  governor_id uuid not null references public.governor(id) on delete restrict,
  rep_partner_id uuid null references public.partner(id) on delete set null,
  reps jsonb null default '[]'::jsonb
);

-- Partner linkage columns
alter table public.partner add column if not exists hos_id uuid null references public.hos(id) on delete set null;
alter table public.partner add column if not exists governor_id uuid null references public.governor(id) on delete set null;
alter table public.partner add column if not exists president_id uuid null references public.president(id) on delete set null;
alter table public.partner add column if not exists ops_permission_type text null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'partner_ops_permission_type_check'
  ) then
    alter table public.partner
      add constraint partner_ops_permission_type_check
      check (ops_permission_type in ('hos', 'governor', 'president') or ops_permission_type is null);
  end if;
end $$;

-- Indexes for operational scope performance
create index if not exists idx_partner_hos_id on public.partner(hos_id);
create index if not exists idx_partner_governor_id on public.partner(governor_id);
create index if not exists idx_partner_president_id on public.partner(president_id);
create index if not exists idx_hos_organisation_id on public.hos(organisation_id);
create index if not exists idx_governor_hos_id on public.governor(hos_id);
create index if not exists idx_president_governor_id on public.president(governor_id);

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_hos_updated_at on public.hos;
create trigger trg_hos_updated_at
before update on public.hos
for each row execute function public.set_updated_at();

drop trigger if exists trg_governor_updated_at on public.governor;
create trigger trg_governor_updated_at
before update on public.governor
for each row execute function public.set_updated_at();

drop trigger if exists trg_president_updated_at on public.president;
create trigger trg_president_updated_at
before update on public.president
for each row execute function public.set_updated_at();

-- Consistency checks between governor/hos and president/hos/governor
create or replace function public.validate_governor_hierarchy()
returns trigger
language plpgsql
as $$
declare
  hos_org_id uuid;
begin
  select organisation_id into hos_org_id from public.hos where id = new.hos_id;

  if hos_org_id is null then
    raise exception 'Invalid hos_id for governor';
  end if;

  if new.organisation_id <> hos_org_id then
    raise exception 'Governor organisation must match HoS organisation';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_governor_hierarchy on public.governor;
create trigger trg_validate_governor_hierarchy
before insert or update on public.governor
for each row execute function public.validate_governor_hierarchy();

create or replace function public.validate_president_hierarchy()
returns trigger
language plpgsql
as $$
declare
  gov_org_id uuid;
  gov_hos_id uuid;
begin
  select organisation_id, hos_id into gov_org_id, gov_hos_id from public.governor where id = new.governor_id;

  if gov_org_id is null or gov_hos_id is null then
    raise exception 'Invalid governor_id for president';
  end if;

  if new.organisation_id <> gov_org_id then
    raise exception 'President organisation must match Governor organisation';
  end if;

  if new.hos_id <> gov_hos_id then
    raise exception 'President hos_id must match Governor hos_id';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_president_hierarchy on public.president;
create trigger trg_validate_president_hierarchy
before insert or update on public.president
for each row execute function public.validate_president_hierarchy();

create or replace function public.validate_partner_operational_assignment()
returns trigger
language plpgsql
as $$
declare
  gov_hos_id uuid;
  pres_hos_id uuid;
  pres_gov_id uuid;
begin
  if new.governor_id is not null then
    select hos_id into gov_hos_id from public.governor where id = new.governor_id;
    if gov_hos_id is null then
      raise exception 'Invalid governor_id on partner';
    end if;
    if new.hos_id is null or new.hos_id <> gov_hos_id then
      raise exception 'partner.hos_id must match governor.hos_id';
    end if;
  end if;

  if new.president_id is not null then
    select hos_id, governor_id into pres_hos_id, pres_gov_id from public.president where id = new.president_id;
    if pres_hos_id is null or pres_gov_id is null then
      raise exception 'Invalid president_id on partner';
    end if;
    if new.hos_id is null or new.hos_id <> pres_hos_id then
      raise exception 'partner.hos_id must match president.hos_id';
    end if;
    if new.governor_id is null or new.governor_id <> pres_gov_id then
      raise exception 'partner.governor_id must match president.governor_id';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_partner_operational_assignment on public.partner;
create trigger trg_validate_partner_operational_assignment
before insert or update on public.partner
for each row execute function public.validate_partner_operational_assignment();
