import * as z from "zod";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { proposedScheduleSchema } from "@/lib/schemas";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import type { PartnerRowType, ProposedPaymentScheduleRowType } from "@/supabase/modifiedSupabaseTypes";
import { fetchG20PaidAmount, fetchProposedScheduleRowsByYear, syncProposedScheduleAfterUpdate } from "@/services/g20Dashboard";
import { generateScheduleAmounts, getNextOct30Window } from "@/services/proposedSchedule";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthInput } from "@/components/ui/authInput";
import { Button } from "@/components/ui/button";

const breakdownOptions = Array.from({ length: 12 }, (_, index) => index + 1);

type UpdateProposedScheduleDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: PartnerRowType;
  onSaved: () => Promise<void>;
};

const isPendingFutureOrDue = (row: ProposedPaymentScheduleRowType, _now: dayjs.Dayjs) => {
  if (String(row.status || "pending").toLowerCase() !== "pending") {
    return false;
  }
  return true;
};

export const UpdateProposedScheduleDrawer = ({ open, setOpen, user, onSaved }: UpdateProposedScheduleDrawerProps) => {
  const [isPending, setIsPending] = useState(false);
  const [skipNextGeneration, setSkipNextGeneration] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(Number(user?.g20_amount || 0));
  const [remainingPendingRows, setRemainingPendingRows] = useState<ProposedPaymentScheduleRowType[]>([]);

  const { maxDate, scheduleYear } = useMemo(() => getNextOct30Window(), []);
  const g20Amount = Number(user?.g20_amount || 0);

  const form = useForm<z.infer<typeof proposedScheduleSchema>>({
    resolver: zodResolver(proposedScheduleSchema),
    defaultValues: {
      breakdown_count: 1,
      g20_amount: g20Amount,
      rows: [{ proposed_amount: g20Amount, proposed_date: "" }],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "rows",
  });

  const breakdownCount = form.watch("breakdown_count");

  useEffect(() => {
    const loadScheduleRows = async () => {
      if (!open || !user?.id) {
        return;
      }

      try {
        const [existingRows, paidAmount] = await Promise.all([fetchProposedScheduleRowsByYear(user.id, scheduleYear), fetchG20PaidAmount(user.id)]);

        const clampedPaidAmount = Math.max(0, Math.min(g20Amount, paidAmount));
        const computedRemaining = Math.max(0, g20Amount - clampedPaidAmount);

        setAmountPaid(clampedPaidAmount);
        setRemainingAmount(computedRemaining);

        const now = dayjs().startOf("day");
        const pendingRows = existingRows.filter((row) => isPendingFutureOrDue(row, now));
        setRemainingPendingRows(pendingRows);

        const defaultCount = pendingRows.length > 0 ? pendingRows.length : 1;
        const generatedAmounts = generateScheduleAmounts(computedRemaining, defaultCount);

        setSkipNextGeneration(true);
        form.setValue("g20_amount", computedRemaining);
        form.setValue("breakdown_count", defaultCount);

        replace(
          generatedAmounts.map((amount, index) => ({
            proposed_amount: amount,
            proposed_date: pendingRows[index]?.proposed_date || "",
          })),
        );
      } catch (error: any) {
        console.log("loadScheduleRows error", error);
        ErrorHandler(error?.message || "Unable to load your proposed schedule.");
      }
    };

    loadScheduleRows();
  }, [form, g20Amount, open, replace, scheduleYear, user?.id]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (skipNextGeneration) {
      setSkipNextGeneration(false);
      return;
    }

    const safeBreakdown = Number(breakdownCount || 1);
    const generatedAmounts = generateScheduleAmounts(remainingAmount, safeBreakdown);
    const existingRows = form.getValues("rows");

    replace(
      generatedAmounts.map((amount, index) => ({
        proposed_amount: amount,
        proposed_date: existingRows[index]?.proposed_date || remainingPendingRows[index]?.proposed_date || "",
      })),
    );
  }, [breakdownCount, form, open, remainingAmount, remainingPendingRows, replace, skipNextGeneration]);

  const onSubmit = async (values: z.infer<typeof proposedScheduleSchema>) => {
    try {
      if (!user?.id) {
        throw new Error("Please login and try again.");
      }

      const hasOutOfRangeDate = values.rows.some((row) => row.proposed_date > maxDate);
      if (hasOutOfRangeDate) {
        throw new Error(`Each proposed date must be on or before ${maxDate}.`);
      }

      const rowSum = values.rows.reduce((sum, row) => sum + Number(row.proposed_amount || 0), 0);
      if (rowSum !== remainingAmount) {
        throw new Error("Updated payment breakdown must exactly match remaining amount.");
      }

      setIsPending(true);

      await syncProposedScheduleAfterUpdate({
        user,
        schedule_year: scheduleYear,
        rows: values.rows.map((row) => ({
          proposed_amount: row.proposed_amount,
          proposed_date: row.proposed_date,
        })),
      });

      await onSaved();
      SuccessHandler("Proposed schedule updated successfully.");
      setOpen(false);
    } catch (error: any) {
      console.log("update proposed schedule error", error);
      ErrorHandler(error?.message || "Unable to update proposed schedule.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto dark:bg-[#13151B]">
        <SheetHeader>
          <SheetTitle className="text-[#1E1E1E] dark:text-white">Update Proposed Schedule</SheetTitle>
          <SheetDescription className="text-gray-600 dark:text-gray-300">
            Update remaining commitments while keeping your total G20 commitment intact.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormItem>
                  <FormLabel className="text-[#1E1E1E] dark:text-gray-100">G20 Total Amount</FormLabel>
                  <FormControl>
                    <AuthInput type="number" disabled value={g20Amount || 0} />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-[#1E1E1E] dark:text-gray-100">Amount Paid</FormLabel>
                  <FormControl>
                    <AuthInput type="number" disabled value={amountPaid || 0} />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel className="text-[#1E1E1E] dark:text-gray-100">Remaining Amount</FormLabel>
                  <FormControl>
                    <AuthInput type="number" disabled value={remainingAmount || 0} />
                  </FormControl>
                </FormItem>

                <FormField
                  control={form.control}
                  name="breakdown_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#1E1E1E] dark:text-gray-100">Breakdown Remaining Into</FormLabel>
                      <FormControl>
                        <Select value={String(field.value)} onValueChange={(value) => field.onChange(Number(value))}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select count" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {breakdownOptions.map((count) => (
                              <SelectItem key={count} value={String(count)}>
                                {count}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-md border border-[#E6D3A4] dark:border-white/20 p-3">
                <h3 className="text-base font-semibold text-[#1E1E1E] dark:text-white mb-2">Updated Payment Breakdown</h3>
                <div className="grid grid-cols-2 gap-2 mb-2 text-sm font-medium text-[#1E1E1E] dark:text-gray-100">
                  <p>Proposed Amount</p>
                  <p>Proposed Date</p>
                </div>

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name={`rows.${index}.proposed_amount`}
                        render={({ field: amountField }) => (
                          <FormItem>
                            <FormControl>
                              <AuthInput type="number" min={0} step={1} placeholder="Amount" {...amountField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`rows.${index}.proposed_date`}
                        render={({ field: dateField }) => (
                          <FormItem>
                            <FormControl>
                              <AuthInput type="date" max={maxDate} {...dateField} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-300">Breakdown sum must equal remaining amount. Latest allowed date is {maxDate}.</div>

              <Button type="submit" className="w-full" variant="custom" disabled={isPending}>
                {isPending ? "Saving.." : "Save Schedule"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
