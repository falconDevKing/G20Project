import dayjs from "dayjs";

import { PaystactPendingPaymentsRowType } from "../../interfaces/modifiedSupabaseTypes";

import SupabaseClient from "../../utils/supabaseConnection";

const PAGE_SIZE = 1000;

export type bulkChargeType = {
  amount: number;
  authorization: string;
  reference: string;
  email: string;
};

export const chunkArray = (array: bulkChargeType[], size: number): bulkChargeType[][] => {
  if (size <= 0) throw new Error("Chunk size must be greater than zero");

  const result: bulkChargeType[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const getTodayPendingPayments = async (
  from: number = 0,
): Promise<{
  pendingPayments: PaystactPendingPaymentsRowType[];
  next: number | null;
}> => {
  const today = dayjs().format("YYYY-MM-DD");

  const to = from + PAGE_SIZE - 1;

  const { data, error } = await SupabaseClient.from("paystack_pending_payments")
    .select()
    .eq("payment_date", today)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetchPendingPayments:", error);
    throw error;
  }

  console.log("paystack_pending_payments from ", from, data.length);
  return {
    pendingPayments: data,
    next: data.length === PAGE_SIZE ? from + PAGE_SIZE : null,
  };
};
