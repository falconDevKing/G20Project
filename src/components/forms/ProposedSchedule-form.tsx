import * as z from "zod";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppSelector } from "@/redux/hooks";
import type { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";
import { proposedScheduleSchema } from "@/lib/schemas";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import { saveProposedSchedule, generateScheduleAmounts, getNextOct30Window } from "@/services/proposedSchedule";

import { CardWrapper } from "../Card-wapper";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AuthInput } from "../ui/authInput";

import Logo from "../../assets/G20_logo.png";

const breakdownOptions = Array.from({ length: 12 }, (_, index) => index + 1);

export const ProposedScheduleForm = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const authState = useAppSelector((state) => state.auth);
  const isAuthenticated = authState.authenticated;
  const currentUser = authState.userDetails as PartnerRowType;

  const { minDate, maxDate, scheduleYear } = useMemo(() => getNextOct30Window(), []);
  const g20Amount = Number(currentUser?.g20_amount || 0);

  const form = useForm<z.infer<typeof proposedScheduleSchema>>({
    resolver: zodResolver(proposedScheduleSchema),
    defaultValues: {
      breakdown_count: 1,
      g20_amount: g20Amount,
      rows: [
        {
          proposed_amount: g20Amount,
          proposed_date: "",
        },
      ],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "rows",
  });

  const breakdownCount = form.watch("breakdown_count");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirectTo=/proposed-schedule");
      return;
    }

    if (!currentUser?.g20_active) {
      navigate("/update");
      return;
    }

    if (currentUser?.proposed_payment_scheduled) {
      navigate("/dashboard");
      return;
    }

    if (!g20Amount || g20Amount <= 0) {
      ErrorHandler("Please complete your G20 amount on the update page first.");
      navigate("/update");
    }
  }, [currentUser?.g20_active, currentUser?.proposed_payment_scheduled, g20Amount, isAuthenticated, navigate]);

  useEffect(() => {
    if (!g20Amount || g20Amount <= 0) {
      return;
    }

    form.setValue("g20_amount", g20Amount);
    const generatedAmounts = generateScheduleAmounts(g20Amount, Number(breakdownCount || 1));
    const existingRows = form.getValues("rows");

    replace(
      generatedAmounts.map((amount, index) => ({
        proposed_amount: amount,
        proposed_date: existingRows[index]?.proposed_date || "",
      })),
    );
  }, [breakdownCount, form, g20Amount, replace]);

  const onSubmit = async (values: z.infer<typeof proposedScheduleSchema>) => {
    try {
      if (!currentUser?.id) {
        throw new Error("Please login to continue.");
      }

      const hasOutOfRangeDate = values.rows.some((row) => row.proposed_date < minDate || row.proposed_date > maxDate);
      if (hasOutOfRangeDate) {
        throw new Error(`Each proposed date must be between ${minDate} and ${maxDate}.`);
      }

      setIsPending(true);

      await saveProposedSchedule({
        user: currentUser,
        scheduleYear,
        rows: values.rows,
      });

      SuccessHandler("Proposed payment schedule saved successfully.");
      navigate("/dashboard");
    } catch (error: any) {
      console.log("proposed schedule error", error);
      ErrorHandler(error?.message || "Unable to save proposed schedule.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <CardWrapper titleImg={Logo} headerLabel="State your preferred payment schedule" backButtonLabel="" backButtenHref="" isRegister>
      <div className="rounded-md border border-[#D4AF37]/25 bg-[#FCF9EF] p-3 text-sm text-[#1E1E1E]">
        This step helps you commit from the beginning and plan your giving cycle with clarity and consistency.
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormItem>
              <FormLabel className="text-[#111c30] font-normal text-base">G20 Total Amount</FormLabel>
              <FormControl>
                <AuthInput type="number" disabled value={g20Amount || 0} />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="breakdown_count"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] font-normal text-base">Breakdown your payment into</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Select value={String(field.value)} onValueChange={(value) => field.onChange(Number(value))}>
                      <SelectTrigger className="h-12" enforceWhite>
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

          <div className="rounded-md border border-[#E6D3A4] p-3">
            <h3 className="text-base text-center font-semibold text-[#1E1E1E] mb-2">Payment Breakdown</h3>
            <div className="grid grid-cols-2 gap-2 mb-2 text-sm font-medium text-[#1E1E1E]">
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
                          <AuthInput type="number" min={1} step={1} placeholder="Amount" {...amountField} />
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
                          <AuthInput type="date" min={minDate} max={maxDate} {...dateField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Proposed Dates can only be selected from {minDate} to {maxDate}.
          </div>

          <Button disabled={isPending} className="w-full text-sm cursor-pointer" size="lg" variant="custom" type="submit">
            {isPending ? "Saving.." : "Save Proposed Schedule"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
