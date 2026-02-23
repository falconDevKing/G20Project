import { PaystactRecurringPaymentsRowType, ChapterRowType, PartnerRowType, PaystactPendingPaymentsInsertType } from "../../interfaces/modifiedSupabaseTypes";
import SupabaseClient from "../../utils/supabaseConnection";

const PAGE_SIZE = 1000;

export const getActiveRecurringPayments = async (
  from: number = 0,
): Promise<{
  activeRecurringPayments: PaystactRecurringPaymentsRowType[];
  next: number | null;
}> => {
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await SupabaseClient.from("paystack_recurring_payments")
    .select()
    .eq("active", true)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching paystack_recurring_payments:", error);
    throw error;
  }

  console.log("paystack_recurring_payments from ", from, data.length);
  return {
    activeRecurringPayments: data,
    next: data.length === PAGE_SIZE ? from + PAGE_SIZE : null,
  };
};

export const pauseRecurringPayments = async (recurringPaymentId: string) => {
  await SupabaseClient.from("paystack_recurring_payments").update({ active: false }).eq("id", recurringPaymentId).select();
  console.log("pausedRecurringPayments", recurringPaymentId);
};

export const getChapters = async () => {
  const chaptersData: Partial<ChapterRowType>[][] = [];

  const PAGE_SIZE = 1000;
  let from = 0;

  const fetchChaptersData = async (): Promise<void> => {
    const { data: chapters, error } = await SupabaseClient.from("chapter")
      .select("id, base_currency")
      .order("id", { ascending: true }) // 👈 Ensures consistent range-based pagination
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching chapters", error);
      throw error;
    }

    if (chapters && chapters.length > 0) {
      chaptersData.push(chapters);

      if (chapters.length === PAGE_SIZE) {
        from += PAGE_SIZE;
        await fetchChaptersData(); //  Recursive call
      }
    }
  };

  await fetchChaptersData();

  console.log("chaptersData", chaptersData.flat().length);

  return chaptersData.flat();
};

export const getUserData = async (userId: string): Promise<PartnerRowType | boolean> => {
  if (!userId) {
    return false;
  }

  const { data: userData } = await SupabaseClient.from("partner").select().eq("id", userId).maybeSingle();

  console.log("getUserData", userData);
  return userData || false;
};

export const createPendingPaymentsBatch = async (pendingPayments: PaystactPendingPaymentsInsertType[]): Promise<{ id: string }[]> => {
  const { data: pendingPaymentRecords, error: pendingPaymentsError } = await SupabaseClient.from("paystack_pending_payments")
    .insert(pendingPayments)
    .select("id");

  if (pendingPaymentsError) {
    console.log("pendingPaymentsError", pendingPaymentsError);
    return [] as { id: string }[];
  }

  console.log("pendingPaymentRecord", pendingPaymentRecords.length);
  return pendingPaymentRecords as { id: string }[];
};
