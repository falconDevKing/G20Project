alter table public.g20_payments
add column if not exists hos_id uuid null references public.hos(id) on delete set null;

alter table public.g20_payments
add column if not exists governor_id uuid null references public.governor(id) on delete set null;

alter table public.g20_payments
add column if not exists president_id uuid null references public.president(id) on delete set null;

alter table public.proposed_payment_schedule
add column if not exists hos_id uuid null references public.hos(id) on delete set null;

alter table public.proposed_payment_schedule
add column if not exists governor_id uuid null references public.governor(id) on delete set null;

alter table public.proposed_payment_schedule
add column if not exists president_id uuid null references public.president(id) on delete set null;

update public.g20_payments gp
set
  hos_id = p.hos_id,
  governor_id = p.governor_id,
  president_id = p.president_id
from public.partner p
where gp.user_id = p.id
  and (gp.hos_id is null or gp.governor_id is null or gp.president_id is null);

update public.proposed_payment_schedule pps
set
  hos_id = p.hos_id,
  governor_id = p.governor_id,
  president_id = p.president_id
from public.partner p
where pps.user_id = p.id
  and (pps.hos_id is null or pps.governor_id is null or pps.president_id is null);

create index if not exists idx_g20_payments_hos_id on public.g20_payments(hos_id);
create index if not exists idx_g20_payments_governor_id on public.g20_payments(governor_id);
create index if not exists idx_g20_payments_president_id on public.g20_payments(president_id);

create index if not exists idx_proposed_payment_schedule_hos_id on public.proposed_payment_schedule(hos_id);
create index if not exists idx_proposed_payment_schedule_governor_id on public.proposed_payment_schedule(governor_id);
create index if not exists idx_proposed_payment_schedule_president_id on public.proposed_payment_schedule(president_id);
