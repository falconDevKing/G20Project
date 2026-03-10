-- G20 admin metrics alignment

alter table public.partner
  add column if not exists g20_status text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ck_partner_g20_status'
  ) THEN
    ALTER TABLE public.partner
      ADD CONSTRAINT ck_partner_g20_status
      CHECK (g20_status IS NULL OR g20_status IN ('consistent', 'active', 'passive'));
  END IF;
END $$;

create index if not exists idx_partner_g20_status on public.partner (g20_status);

create or replace function public.get_g20_partner_metrics_filtered (
  input_division_id uuid default null,
  input_chapter_id uuid default null
) returns jsonb language plpgsql as $$
declare
  total_partners integer := 0;
  consistent_partners integer := 0;
  active_partners integer := 0;
  passive_partners integer := 0;

  bronze_partners integer := 0;
  silver_partners integer := 0;
  gold_partners integer := 0;
  diamond_partners integer := 0;
  platinum_partners integer := 0;
begin
  select count(*) into total_partners
  from public.partner p
  where (input_division_id is null or p.division_id = input_division_id)
    and (input_chapter_id is null or p.chapter_id = input_chapter_id)
    and coalesce(p.g20_active, false) = true;

  select count(*) into consistent_partners
  from public.partner p
  where (input_division_id is null or p.division_id = input_division_id)
    and (input_chapter_id is null or p.chapter_id = input_chapter_id)
    and coalesce(p.g20_active, false) = true
    and lower(coalesce(p.g20_status, '')) = 'consistent';

  select count(*) into active_partners
  from public.partner p
  where (input_division_id is null or p.division_id = input_division_id)
    and (input_chapter_id is null or p.chapter_id = input_chapter_id)
    and coalesce(p.g20_active, false) = true
    and lower(coalesce(p.g20_status, '')) = 'active';

  select count(*) into passive_partners
  from public.partner p
  where (input_division_id is null or p.division_id = input_division_id)
    and (input_chapter_id is null or p.chapter_id = input_chapter_id)
    and coalesce(p.g20_active, false) = true
    and (
      p.g20_status is null
      or btrim(p.g20_status) = ''
      or lower(p.g20_status) = 'passive'
    );

  select count(*) into bronze_partners
  from public.partner p
  where (input_division_id is null or p.division_id = input_division_id)
    and (input_chapter_id is null or p.chapter_id = input_chapter_id)
    and coalesce(p.g20_active, false) = true
    and lower(coalesce(p.g20_category, '')) = 'bronze';

  select count(*) into silver_partners
  from public.partner p
  where (input_division_id is null or p.division_id = input_division_id)
    and (input_chapter_id is null or p.chapter_id = input_chapter_id)
    and coalesce(p.g20_active, false) = true
    and lower(coalesce(p.g20_category, '')) = 'silver';

  select count(*) into gold_partners
  from public.partner p
  where (input_division_id is null or p.division_id = input_division_id)
    and (input_chapter_id is null or p.chapter_id = input_chapter_id)
    and coalesce(p.g20_active, false) = true
    and lower(coalesce(p.g20_category, '')) = 'gold';

  select count(*) into diamond_partners
  from public.partner p
  where (input_division_id is null or p.division_id = input_division_id)
    and (input_chapter_id is null or p.chapter_id = input_chapter_id)
    and coalesce(p.g20_active, false) = true
    and lower(coalesce(p.g20_category, '')) = 'diamond';

  select count(*) into platinum_partners
  from public.partner p
  where (input_division_id is null or p.division_id = input_division_id)
    and (input_chapter_id is null or p.chapter_id = input_chapter_id)
    and coalesce(p.g20_active, false) = true
    and lower(coalesce(p.g20_category, '')) = 'platinum';

  return jsonb_build_object(
    'Status', jsonb_build_array(
      jsonb_build_object('title', 'Total Partners', 'value', total_partners),
      jsonb_build_object('title', 'Consistent Partners', 'value', consistent_partners),
      jsonb_build_object('title', 'Active Partners', 'value', active_partners),
      jsonb_build_object('title', 'Passive Partners', 'value', passive_partners)
    ),
    'G20_Category', jsonb_build_array(
      jsonb_build_object('title', 'Bronze', 'value', bronze_partners),
      jsonb_build_object('title', 'Silver', 'value', silver_partners),
      jsonb_build_object('title', 'Gold', 'value', gold_partners),
      jsonb_build_object('title', 'Diamond', 'value', diamond_partners),
      jsonb_build_object('title', 'Platinum', 'value', platinum_partners)
    )
  );
end;
$$;

create or replace function public.get_g20_remission_metrics_filtered(
  input_division_id uuid default null,
  input_chapter_id uuid default null,
  input_remission_period text default null
)
returns jsonb
language sql
stable
as $$
  with scoped as (
    select p.*
    from public.g20_payments p
    where (input_division_id is null or p.division_id = input_division_id)
      and (input_chapter_id is null or p.chapter_id = input_chapter_id)
  ),
  paid as (
    select *
    from scoped
    where lower(coalesce(status, '')) in ('paid', 'cleared', 'approved', 'setup')
  ),
  pending as (
    select *
    from scoped
    where lower(coalesce(status, '')) in ('pending', 'due')
  ),
  overall as (
    select
      coalesce(sum(amount) filter (where payment_date >= date_trunc('month', current_date)::date), 0) as inflow_mtd,
      coalesce(sum(amount) filter (where payment_date >= date_trunc('quarter', current_date)::date), 0) as inflow_qtd,
      coalesce(sum(amount) filter (where payment_date >= date_trunc('year', current_date)::date), 0) as inflow_ytd,
      count(*)::int as total_payments,
      coalesce(avg(amount), 0)::numeric as avg_payment
    from paid
  ),
  pending_totals as (
    select
      count(*)::int as pending_count,
      coalesce(sum(amount), 0)::numeric as pending_value
    from pending
  ),
  period_totals as (
    select
      p.currency,
      coalesce(sum(p.amount)::numeric, 0) as total_value,
      coalesce(sum(p.amount) filter (
        where lower(coalesce(p.payment_channel, '')) in ('online', 'card', 'paystack', 'stripe', 'flutterwave', 'web')
      )::numeric, 0) as online_value,
      coalesce(sum(p.amount) filter (
        where lower(coalesce(p.payment_channel, '')) not in ('online', 'card', 'paystack', 'stripe', 'flutterwave', 'web')
      )::numeric, 0) as offline_value,
      count(*) filter (where lower(coalesce(p.payment_channel, '')) in ('online', 'card', 'paystack', 'stripe', 'flutterwave', 'web')) as online_count,
      count(*) as total_count
    from paid p
    where to_char(p.payment_date, 'FMMonth YYYY') = coalesce(input_remission_period, to_char(current_date, 'FMMonth YYYY'))
    group by p.currency
  ),
  period_json as (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'currency', currency,
          'total_value', total_value,
          'online_value', online_value,
          'offline_value', offline_value,
          'online_count', online_count,
          'total_count', total_count
        )
        order by currency
      ),
      '[]'::jsonb
    ) as rows
    from period_totals
  )
  select jsonb_build_object(
    'Payment_Inflow', jsonb_build_array(
      jsonb_build_object('title', 'Inflow Month to Date (MTD)', 'value', o.inflow_mtd, 'convertCurrency', true),
      jsonb_build_object('title', 'Inflow Quarter to Date (QTD)', 'value', o.inflow_qtd, 'convertCurrency', true),
      jsonb_build_object('title', 'Inflow Year to Date (YTD)', 'value', o.inflow_ytd, 'convertCurrency', true)
    ),
    'Annual_Payment_Overview', jsonb_build_array(
      jsonb_build_object('title', 'No. of Payments', 'value', o.total_payments),
      jsonb_build_object('title', 'Frequency of Payments', 'value', (o.total_payments / greatest(extract(month from current_date)::int, 1))),
      jsonb_build_object('title', 'Avg. Value of Payments', 'value', o.avg_payment, 'convertCurrency', true)
    ),
    'Pending_Remissions', jsonb_build_array(
      jsonb_build_object('title', 'No. of Pending Remissions', 'value', p.pending_count),
      jsonb_build_object('title', 'Value. of Pending Remissions', 'value', p.pending_value, 'convertCurrency', true)
    ),
    'Monthly_Remission_Totals', pj.rows
  )
  from overall o
  cross join pending_totals p
  cross join period_json pj;
$$;

create or replace function public.get_g20_partnership_totals(
  p_division_id uuid default null,
  p_chapter_id uuid default null
)
returns table (
  currency text,
  total_value numeric
)
language sql
stable
as $$
  with rates as (
    select * from (values
      ('NGN','Bronze',1000000::numeric),
      ('NGN','Silver',2000000),
      ('NGN','Gold',5000000),
      ('NGN','Diamond',10000000),
      ('NGN','Platinum',25000000),

      ('GBP','Bronze',500),
      ('GBP','Silver',1000),
      ('GBP','Gold',2500),
      ('GBP','Diamond',5000),
      ('GBP','Platinum',12500),

      ('USD','Bronze',650),
      ('USD','Silver',1300),
      ('USD','Gold',3200),
      ('USD','Diamond',6400),
      ('USD','Platinum',16000),

      ('CAD','Bronze',900),
      ('CAD','Silver',1700),
      ('CAD','Gold',4300),
      ('CAD','Diamond',8600),
      ('CAD','Platinum',21500),

      ('GHS','Bronze',10000),
      ('GHS','Silver',20000),
      ('GHS','Gold',50000),
      ('GHS','Diamond',100000),
      ('GHS','Platinum',250000),

      ('ZAR','Bronze',12000),
      ('ZAR','Silver',24000),
      ('ZAR','Gold',60000),
      ('ZAR','Diamond',120000),
      ('ZAR','Platinum',300000),

      ('EUR','Bronze',600),
      ('EUR','Silver',1200),
      ('EUR','Gold',3000),
      ('EUR','Diamond',6000),
      ('EUR','Platinum',15000),

      ('MXN','Bronze',12500),
      ('MXN','Silver',25000),
      ('MXN','Gold',62500),
      ('MXN','Diamond',125000),
      ('MXN','Platinum',312500),

      ('PHP','Bronze',35000),
      ('PHP','Silver',70000),
      ('PHP','Gold',175000),
      ('PHP','Diamond',350000),
      ('PHP','Platinum',875000),

      ('AED','Bronze',2300),
      ('AED','Silver',4600),
      ('AED','Gold',11500),
      ('AED','Diamond',23000),
      ('AED','Platinum',57500),

      ('USDAF','Bronze',650),
      ('USDAF','Silver',1300),
      ('USDAF','Gold',3200),
      ('USDAF','Diamond',6400),
      ('USDAF','Platinum',16000)
    ) as v(currency, category, amount)
  )
  select
    c.base_currency as currency,
    coalesce(
      sum(
        case
          when p.g20_amount is not null and p.g20_amount > 0
            then p.g20_amount
          else r.amount
        end
      ),
      0
    ) as total_value
  from public.partner p
  join public.chapter c on c.id = p.chapter_id
  left join rates r
    on r.currency = c.base_currency
   and lower(r.category) = lower(coalesce(p.ggp_category, ''))
  where (p_division_id is null or p.division_id = p_division_id)
    and (p_chapter_id is null or p.chapter_id = p_chapter_id)
    and coalesce(p.g20_active, false) = true
  group by c.base_currency
  order by c.base_currency;
$$;
