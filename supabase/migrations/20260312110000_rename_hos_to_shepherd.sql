alter table if exists public.hos rename to shepherd;

alter table if exists public.partner rename column hos_id to shepherd_id;
alter table if exists public.governor rename column hos_id to shepherd_id;
alter table if exists public.president rename column hos_id to shepherd_id;
alter table if exists public.g20_payments rename column hos_id to shepherd_id;
alter table if exists public.proposed_payment_schedule rename column hos_id to shepherd_id;

alter index if exists public.idx_partner_hos_id rename to idx_partner_shepherd_id;
alter index if exists public.idx_hos_organisation_id rename to idx_shepherd_organisation_id;
alter index if exists public.idx_governor_hos_id rename to idx_governor_shepherd_id;
alter index if exists public.idx_g20_payments_hos_id rename to idx_g20_payments_shepherd_id;
alter index if exists public.idx_proposed_payment_schedule_hos_id rename to idx_proposed_payment_schedule_shepherd_id;

drop trigger if exists trg_validate_partner_operational_assignment on public.partner;

alter table public.partner drop constraint if exists partner_ops_permission_type_check;

update public.partner
set ops_permission_type = 'shepherd'
where ops_permission_type = 'hos';

update public.partner
set ops_permission_type = null
where ops_permission_type is not null
  and ops_permission_type not in ('shepherd', 'governor', 'president');


alter table public.partner
  add constraint partner_ops_permission_type_check
  check (ops_permission_type in ('shepherd', 'governor', 'president') or ops_permission_type is null);

drop trigger if exists trg_hos_updated_at on public.shepherd;
create trigger trg_shepherd_updated_at
before update on public.shepherd
for each row execute function public.set_updated_at();

-- drop function if exists public.validate_governor_hierarchy();
create or replace function public.validate_governor_hierarchy()
returns trigger
language plpgsql
as $$
declare
  shepherd_org_id uuid;
begin
  select organisation_id into shepherd_org_id from public.shepherd where id = new.shepherd_id;

  if shepherd_org_id is null then
    raise exception 'Invalid shepherd_id for governor';
  end if;

  if new.organisation_id <> shepherd_org_id then
    raise exception 'Governor organisation must match Shepherd organisation';
  end if;

  return new;
end;
$$;

-- drop function if exists public.validate_president_hierarchy();
create or replace function public.validate_president_hierarchy()
returns trigger
language plpgsql
as $$
declare
  gov_org_id uuid;
  gov_shepherd_id uuid;
begin
  select organisation_id, shepherd_id into gov_org_id, gov_shepherd_id from public.governor where id = new.governor_id;

  if gov_org_id is null or gov_shepherd_id is null then
    raise exception 'Invalid governor_id for president';
  end if;

  if new.organisation_id <> gov_org_id then
    raise exception 'President organisation must match Governor organisation';
  end if;

  if new.shepherd_id <> gov_shepherd_id then
    raise exception 'President shepherd_id must match Governor shepherd_id';
  end if;

  return new;
end;
$$;

-- drop function if exists public.validate_partner_operational_assignment();
create or replace function public.validate_partner_operational_assignment()
returns trigger
language plpgsql
as $$
declare
  gov_shepherd_id uuid;
  pres_shepherd_id uuid;
  pres_gov_id uuid;
begin
  if new.governor_id is not null then
    select shepherd_id into gov_shepherd_id from public.governor where id = new.governor_id;
    if gov_shepherd_id is null then
      raise exception 'Invalid governor_id on partner';
    end if;
    if new.shepherd_id is null or new.shepherd_id <> gov_shepherd_id then
      raise exception 'partner.shepherd_id must match governor.shepherd_id';
    end if;
  end if;

  if new.president_id is not null then
    select shepherd_id, governor_id into pres_shepherd_id, pres_gov_id from public.president where id = new.president_id;
    if pres_shepherd_id is null or pres_gov_id is null then
      raise exception 'Invalid president_id on partner';
    end if;
    if new.shepherd_id is null or new.shepherd_id <> pres_shepherd_id then
      raise exception 'partner.shepherd_id must match president.shepherd_id';
    end if;
    if new.governor_id is null or new.governor_id <> pres_gov_id then
      raise exception 'partner.governor_id must match president.governor_id';
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_validate_partner_operational_assignment
before insert or update on public.partner
for each row execute function public.validate_partner_operational_assignment();
