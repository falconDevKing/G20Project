-- Add generated name_code to g20_payments
ALTER TABLE public.g20_payments
ADD COLUMN IF NOT EXISTS name_code text
GENERATED ALWAYS AS (
  (
    (
      (
        (COALESCE(first_name, ''::text) || ' '::text) || COALESCE(last_name, ''::text)
      ) || ' - '::text
    ) || COALESCE(unique_code, ''::text)
  )
) STORED;

-- Add generated name_code to proposed_payment_schedule
ALTER TABLE public.proposed_payment_schedule
ADD COLUMN IF NOT EXISTS name_code text
GENERATED ALWAYS AS (
  (
    (
      (
        (COALESCE(first_name, ''::text) || ' '::text) || COALESCE(last_name, ''::text)
      ) || ' - '::text
    ) || COALESCE(unique_code, ''::text)
  )
) STORED;

-- Add generated marriage_anniversary_mmdd to partner
ALTER TABLE public.partner
ADD COLUMN IF NOT EXISTS marriage_anniversary_mmdd text
GENERATED ALWAYS AS (
  substring(marriage_anniversary FROM 6 FOR 5)
) STORED;