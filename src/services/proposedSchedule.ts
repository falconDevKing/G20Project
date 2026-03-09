import SupabaseClient from "@/supabase/supabaseConnection";
import type { PartnerRowType, ProposedPaymentScheduleInsertType, ProposedPaymentScheduleRowType } from "@/supabase/modifiedSupabaseTypes";
import { updateUser } from "@/services/auth";

export type ProposedScheduleRowInput = {
  proposed_amount: number;
  proposed_date: string;
};

const toDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getNextOct30Window = (baseDate = new Date()) => {
  const today = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const currentYearOct30 = new Date(today.getFullYear(), 9, 30);

  const targetOct30 = today <= currentYearOct30 ? currentYearOct30 : new Date(today.getFullYear() + 1, 9, 30);

  return {
    minDate: toDateString(today),
    maxDate: toDateString(targetOct30),
    scheduleYear: targetOct30.getFullYear(),
  };
};

export const generateScheduleAmounts = (total: number, breakdownCount: number): number[] => {
  if (total <= 0 || breakdownCount <= 0) {
    return [0];
  }

  const safeCount = Math.max(1, breakdownCount);
  const baseAmount = Number((total / safeCount).toPrecision(2));
  const amounts = Array.from({ length: safeCount }, () => baseAmount);
  const subtotal = baseAmount * safeCount;
  amounts[safeCount - 1] = baseAmount + (total - subtotal);

  return amounts;
};

export const hasProposedScheduleForYear = async (userId: string, scheduleYear: number): Promise<boolean> => {
  const { data, error } = await SupabaseClient.from("proposed_payment_schedule").select("id").eq("user_id", userId).eq("schedule_year", scheduleYear).limit(1);

  if (error) {
    throw error;
  }

  return !!data?.length;
};

export const saveProposedSchedule = async ({ user, scheduleYear, rows }: { user: PartnerRowType; scheduleYear: number; rows: ProposedScheduleRowInput[] }) => {
  const hasExistingRows = await hasProposedScheduleForYear(user.id, scheduleYear);

  if (hasExistingRows) {
    throw new Error(`A proposed schedule already exists for ${scheduleYear}.`);
  }

  const payload: ProposedPaymentScheduleInsertType[] = rows.map((row, index) => ({
    user_id: user.id,
    schedule_year: scheduleYear,
    schedule_index: index + 1,
    proposed_amount: row.proposed_amount,
    proposed_date: row.proposed_date,
    unique_code: user.unique_code,
    organisation_id: user.organisation_id,
    division_id: user.division_id,
    chapter_id: user.chapter_id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  }));

  const { data, error } = await SupabaseClient.from("proposed_payment_schedule").insert(payload).select();

  if (error) {
    throw error;
  }

  await updateUser({
    id: user.id,
    proposed_payment_scheduled: true,
  });

  return data as ProposedPaymentScheduleRowType[];
};
