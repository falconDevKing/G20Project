-- G20 dashboard follow-up updates

alter table public.g20_payments
  add column if not exists description text null,
  add column if not exists proof_file_path text null;

-- if notes exists from prior migration, move values and drop it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'g20_payments'
      AND column_name = 'notes'
  ) THEN
    UPDATE public.g20_payments
    SET description = COALESCE(description, notes)
    WHERE notes IS NOT NULL;

    ALTER TABLE public.g20_payments
      DROP COLUMN notes;
  END IF;
END $$;

alter table public.proposed_payment_schedule
  add column if not exists status text not null default 'pending';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ck_proposed_payment_schedule_status'
  ) THEN
    ALTER TABLE public.proposed_payment_schedule
      ADD CONSTRAINT ck_proposed_payment_schedule_status
      CHECK (status IN ('pending', 'missed', 'cleared'));
  END IF;
END $$;

create index if not exists idx_proposed_payment_schedule_user_year_status
  on public.proposed_payment_schedule (user_id, schedule_year, status);

create index if not exists idx_proposed_payment_schedule_user_date_status
  on public.proposed_payment_schedule (user_id, proposed_date, status);

alter table public.partner
  add column if not exists g20_paystack_customer_code text null,
  add column if not exists g20_paystack_customer_id text null,
  add column if not exists g20_paystack_authorization_code text null,
  add column if not exists g20_paystack_authorization_details jsonb null;
