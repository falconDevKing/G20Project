ALTER TABLE public.proposed_payment_schedule
ADD COLUMN IF NOT EXISTS currency text;

UPDATE public.proposed_payment_schedule AS pps
SET currency = c.base_currency
FROM public.chapter AS c
WHERE pps.chapter_id = c.id
  AND pps.currency IS NULL;
