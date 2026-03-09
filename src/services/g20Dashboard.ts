import SupabaseClient from "@/supabase/supabaseConnection";
import type {
  G20PaymentInsertType,
  G20PaymentRowType,
  G20PaymentUpdateType,
  PartnerRowType,
  ProposedPaymentScheduleInsertType,
  ProposedPaymentScheduleRowType,
} from "@/supabase/modifiedSupabaseTypes";
import dayjs from "dayjs";

export type G20AutomationState = {
  automated: boolean;
  subscription_ids: Record<string, any>[];
};

export type G20PaymentStats = {
  total_count: number;
  total_value: number;
};

export type ProposedDisplayStatus = "pending" | "missed" | "cleared" | "due";

export const normaliseG20SubscriptionIds = (value: unknown): Record<string, any>[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item) => !!item && typeof item === "object") as Record<string, any>[];
};

export const isG20Automated = (user: Pick<PartnerRowType, "g20_subscription_ids"> | null | undefined): boolean => {
  const ids = normaliseG20SubscriptionIds(user?.g20_subscription_ids);
  return ids.length > 0;
};

export const fetchG20AutomationState = async (user_id: string): Promise<G20AutomationState> => {
  if (!user_id) {
    return { automated: false, subscription_ids: [] };
  }

  const { data, error } = await SupabaseClient.from("partner").select("g20_subscription_ids").eq("id", user_id).maybeSingle();

  if (error) {
    throw error;
  }

  const subscription_ids = normaliseG20SubscriptionIds(data?.g20_subscription_ids);

  return {
    automated: subscription_ids.length > 0,
    subscription_ids,
  };
};

export const fetchG20PaymentStats = async (user_id: string): Promise<G20PaymentStats> => {
  if (!user_id) {
    return { total_count: 0, total_value: 0 };
  }

  const { data, error } = await SupabaseClient.from("g20_payments").select("amount,status").eq("user_id", user_id);

  if (error) {
    throw error;
  }

  const paidStatuses = new Set(["paid", "cleared", "approved", "setup"]);
  const paidRows = (data || []).filter((row) => paidStatuses.has(String(row.status || "").toLowerCase()));
  const total_value = paidRows.reduce((sum, row) => sum + Number(row.amount || 0), 0);

  return {
    total_count: paidRows.length,
    total_value,
  };
};

export const fetchG20PaidAmount = async (user_id: string): Promise<number> => {
  if (!user_id) {
    return 0;
  }

  const { data, error } = await SupabaseClient.from("g20_payments").select("amount,status").eq("user_id", user_id);

  if (error) {
    throw error;
  }

  const paidStatuses = new Set(["paid", "cleared", "approved", "setup"]);
  return (data || []).reduce((sum, row) => {
    const status = String(row.status || "").toLowerCase();
    if (!paidStatuses.has(status)) {
      return sum;
    }
    return sum + Number(row.amount || 0);
  }, 0);
};

export const fetchG20Payments = async ({
  user_id,
  page = 1,
  pageSize = 20,
}: {
  user_id: string;
  page?: number;
  pageSize?: number;
}) => {
  if (!user_id) {
    return { data: [] as G20PaymentRowType[], count: 0 };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await SupabaseClient.from("g20_payments")
    .select("*", { count: "exact" })
    .eq("user_id", user_id)
    .order("payment_date", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    data: (data || []) as G20PaymentRowType[],
    count: count || 0,
  };
};

export const createG20Payment = async (payload: G20PaymentInsertType) => {
  const { data, error } = await SupabaseClient.from("g20_payments").insert(payload).select().maybeSingle();

  if (error) {
    throw error;
  }

  return data as G20PaymentRowType;
};

export const updateG20Payment = async (payment_id: string, payload: G20PaymentUpdateType) => {
  const { data, error } = await SupabaseClient.from("g20_payments").update(payload).eq("id", payment_id).select().maybeSingle();

  if (error) {
    throw error;
  }

  return data as G20PaymentRowType;
};

export const fetchProposedScheduleRows = async ({
  user_id,
  page = 1,
  pageSize = 20,
}: {
  user_id: string;
  page?: number;
  pageSize?: number;
}) => {
  if (!user_id) {
    return { data: [] as ProposedPaymentScheduleRowType[], count: 0 };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await SupabaseClient.from("proposed_payment_schedule")
    .select("*", { count: "exact" })
    .eq("user_id", user_id)
    .order("schedule_year", { ascending: false })
    .order("proposed_date", { ascending: true })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    data: (data || []) as ProposedPaymentScheduleRowType[],
    count: count || 0,
  };
};

export const fetchProposedScheduleRowsByYear = async (user_id: string, schedule_year: number) => {
  if (!user_id) {
    return [] as ProposedPaymentScheduleRowType[];
  }

  const { data, error } = await SupabaseClient.from("proposed_payment_schedule")
    .select("*")
    .eq("user_id", user_id)
    .eq("schedule_year", schedule_year)
    .order("schedule_index", { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []) as ProposedPaymentScheduleRowType[];
};

export const getProposedDisplayStatus = (
  row: Pick<ProposedPaymentScheduleRowType, "status" | "proposed_date">,
  baseDate: Date = new Date(),
): ProposedDisplayStatus => {
  const normalisedStatus = String(row.status || "pending").toLowerCase() as "pending" | "missed" | "cleared";
  if (normalisedStatus !== "pending") {
    return normalisedStatus;
  }

  const today = dayjs(baseDate).startOf("day");
  const proposedDate = dayjs(row.proposed_date).startOf("day");

  if (proposedDate.isSame(today) || proposedDate.isBefore(today)) {
    return "due";
  }

  return "pending";
};

export const syncProposedScheduleAfterUpdate = async ({
  user,
  schedule_year,
  rows,
  baseDate = new Date(),
}: {
  user: PartnerRowType;
  schedule_year: number;
  rows: { proposed_amount: number; proposed_date: string }[];
  baseDate?: Date;
}) => {
  const today = dayjs(baseDate).startOf("day").format("YYYY-MM-DD");

  const { data: existingRows, error: existingRowsError } = await SupabaseClient.from("proposed_payment_schedule")
    .select("*")
    .eq("user_id", user.id)
    .eq("schedule_year", schedule_year)
    .order("schedule_index", { ascending: true });

  if (existingRowsError) {
    throw existingRowsError;
  }

  const allRows = (existingRows || []) as ProposedPaymentScheduleRowType[];

  const { error: pastPendingError } = await SupabaseClient.from("proposed_payment_schedule")
    .update({ status: "missed" })
    .eq("user_id", user.id)
    .eq("schedule_year", schedule_year)
    .eq("status", "pending")
    .lt("proposed_date", today);

  if (pastPendingError) {
    throw pastPendingError;
  }

  const { error: futurePendingDeleteError } = await SupabaseClient.from("proposed_payment_schedule")
    .delete()
    .eq("user_id", user.id)
    .eq("schedule_year", schedule_year)
    .eq("status", "pending")
    .gt("proposed_date", today);

  if (futurePendingDeleteError) {
    throw futurePendingDeleteError;
  }

  const highestIndex = allRows
    .filter((row) => !(String(row.status || "").toLowerCase() === "pending" && String(row.proposed_date) > today))
    .reduce((max, row) => Math.max(max, Number(row.schedule_index || 0)), 0);

  const payload: ProposedPaymentScheduleInsertType[] = rows.map((row, index) => ({
    user_id: user.id,
    schedule_year,
    schedule_index: highestIndex + index + 1,
    proposed_amount: row.proposed_amount,
    proposed_date: row.proposed_date,
    unique_code: user.unique_code,
    organisation_id: user.organisation_id,
    division_id: user.division_id,
    chapter_id: user.chapter_id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    status: "pending",
  }));

  const { data, error } = await SupabaseClient.from("proposed_payment_schedule").insert(payload).select();

  if (error) {
    throw error;
  }

  return (data || []) as ProposedPaymentScheduleRowType[];
};

export const replaceProposedScheduleRowsForYear = async ({
  user_id,
  schedule_year,
  rows,
}: {
  user_id: string;
  schedule_year: number;
  rows: ProposedPaymentScheduleInsertType[];
}) => {
  if (!user_id) {
    throw new Error("Missing user id");
  }

  const { error: deleteError } = await SupabaseClient.from("proposed_payment_schedule").delete().eq("user_id", user_id).eq("schedule_year", schedule_year);

  if (deleteError) {
    throw deleteError;
  }

  const { data, error } = await SupabaseClient.from("proposed_payment_schedule").insert(rows).select();

  if (error) {
    throw error;
  }

  return (data || []) as ProposedPaymentScheduleRowType[];
};
