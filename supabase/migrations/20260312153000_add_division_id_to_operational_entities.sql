alter table if exists public.shepherd
add column if not exists division_id uuid null references public.division (id);

alter table if exists public.governor
add column if not exists division_id uuid null references public.division (id);

alter table if exists public.president
add column if not exists division_id uuid null references public.division (id);