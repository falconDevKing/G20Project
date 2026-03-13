alter table public.partner
  add column if not exists g20_status text null,
  add column if not exists g20_active_recurring_remission boolean not null default false;

-- alter table public.partner
--   alter column g20_active_recurring_remission set default false;

update public.partner
set
  g20_status = 'passive'
where
  g20_status is null;

-- alter table public.partner
--   alter column g20_status set default 'passive';

-- alter table public.partner
--   alter column g20_active_recurring_remission set default false;

-- update public.partner
-- set g20_status = 'passive'
-- where g20_status is null;
