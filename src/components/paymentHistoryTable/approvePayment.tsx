import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DatePicker from "react-datepicker";
import { paymentFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialiseOptions, RemissionPeriodsOptions } from "@/lib/utils";
import { SelectOptions } from "@/interfaces/register";
import { useAppSelector } from "@/redux/hooks";
import dayjs from "dayjs";
import {
  findChapterDetails,
  getUserWithUniqueCode,
  initialPayerData,
  type PayerDataType,
  approvePayment,
  cancelPayment,
} from "@/services/payment";
import { Switch } from "@/components/ui/switch";
import { WorldCurrenciesOptions } from "@/constants/currencies";

import { refreshLoggedInUser } from "@/services/auth";
import { SuccessHandler, ErrorHandler, InfoHandler } from "@/lib/toastHandlers";
import FormTooltip from "../FormTooltips";
import FetchGBPExchangeRatesValue from "@/lib/fetchGBPExchangeRatesValue";
import { PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
import { getCurrencySymbol } from "@/lib/numberUtils";

//TODO:  Reemove hidden from currency conversion

type PaymentFormValues = z.infer<typeof paymentFormSchema>;


type postApprovePaymentProcessingType = {
  user_name: string;
  currency: string;
  amount: number;
  remission_period: string;
  payment_date: string;
  chapterName: string;
  approved_by: string;
  payerDataUser_id: string;
  payerDataRemission_start_date: string;
  userId: string;
  payerDataEmail: string;
  payerDataPhone_number: string;
}

interface ApprovePaymentProps {
  paymentData?: PaymentRowType;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  setRefreshData?: React.Dispatch<React.SetStateAction<number>>;
  postApprovePaymentProcessing: (postApprovePaymentProcessingData: postApprovePaymentProcessingType) => Promise<void>
}

export const ApprovePayment = ({ paymentData, openDialog, setOpenDialog, setRefreshData, postApprovePaymentProcessing }: ApprovePaymentProps) => {
  const appState = useAppSelector((state) => state.app);
  const user = useAppSelector((state) => state.auth.userDetails);

  const { AppOrganisationId, DivisionOptions, ChapterOptions } = initialiseOptions(appState);

  const [isPending, setIsPending] = useState<boolean>(false);
  const [chapterCurrency, setChapterCurrency] = useState("");
  const [payerCode, setPayerCode] = useState(paymentData?.unique_code || "");
  const [payerData, setPayerData] = useState<PayerDataType>(initialPayerData);

  const approvalForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      unique_code: paymentData?.unique_code || "",
      amount: paymentData?.amount || 0,
      payment_date: paymentData?.payment_date || "",
      description: paymentData?.description || "",
      remission_period: paymentData?.remission_period ? dayjs(paymentData?.remission_period).format() || "" : "",
      division_id: paymentData?.division_id || "",
      chapter_id: paymentData?.chapter_id || "",

      is_converted: paymentData?.is_converted || false,
      conversion_description: paymentData?.conversion_description || "",
      conversion_amount: paymentData?.conversion_amount || 0,
      conversion_rate: paymentData?.conversion_rate || 0,
      conversion_currency: paymentData?.conversion_currency || "",
      conversion_time: paymentData?.conversion_time || "",
    },
  });

  const selectedChapterId = approvalForm.watch("chapter_id")
  const selectedChapterCurrecny = useMemo(() => findChapterDetails(selectedChapterId)?.currency, [selectedChapterId]);

  const onSubmit = async () => {
    try {
      setIsPending(true);

      const values = approvalForm.watch();

      const {
        unique_code,
        amount,
        remission_period,
        payment_date,
        chapter_id,
        division_id,
        description,
        is_converted,
        conversion_description,
        conversion_amount,
        conversion_rate,
        conversion_currency,
        conversion_time,
      } = values;

      const conversionData = is_converted
        ? {
          is_converted,
          conversion_description,
          conversion_amount,
          conversion_rate,
          conversion_currency,
          conversion_time,
        }
        : {};

      const { currency, chapterName } = findChapterDetails(chapter_id);

      const rate = await FetchGBPExchangeRatesValue(currency);

      const user_name = payerData.user_name;
      const approved_by = (user?.first_name || "") + " " + (user?.last_name || "");
      const approved_by_id = user?.id || "";
      const approved_by_image = user?.image_url || "";

      const newEntry = {
        id: paymentData?.id || "",
        unique_code: unique_code,
        currency,
        amount: +amount,
        payment_date: payment_date,
        remission_month: remission_period.split(" ")[0],
        remission_year: remission_period.split(" ")[1],
        remission_period,
        status: "Paid",
        description,
        user_name,
        approved_by,
        approved_by_id,
        approved_by_image,
        gbp_equivalent: +amount / +(rate || 1),

        organisation_id: AppOrganisationId,
        division_id,
        chapter_id,
        user_id: payerData.user_id,
        ...conversionData,
      };

      await approvePayment(newEntry);


      postApprovePaymentProcessing({ user_name, currency, amount, remission_period, payment_date, chapterName, approved_by, payerDataUser_id: payerData.user_id, payerDataRemission_start_date: payerData.remission_start_date, userId: user.id, payerDataEmail: payerData.email, payerDataPhone_number: payerData.phone_number })

      approvalForm.reset();
      SuccessHandler("Approval Successful");
      setOpenDialog(false);
    } catch (error) {
      console.log("register error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = async () => {
    if (paymentData?.id) {
      await cancelPayment(paymentData?.id || "");
      InfoHandler("Cancelled Payment Successful");

      await updateDisplayedPayments();

      setOpenDialog(false);
    }
  };

  const updateDisplayedPayments = async () => {
    setRefreshData && setRefreshData((prev) => prev + 1);

    if (user.id === payerData.user_id) {
      await refreshLoggedInUser(user.id || "");
    }
  };

  useEffect(() => {
    const fetchPayerData = async (unique_code: string) => {
      const payerData = await getUserWithUniqueCode(unique_code);

      const { division_id, chapter_id } = payerData;
      approvalForm.setValue("division_id", division_id);
      approvalForm.setValue("chapter_id", chapter_id);
      const { currency } = findChapterDetails(chapter_id);
      setChapterCurrency(currency);
      setPayerData(payerData);
    };

    if (payerCode) {
      fetchPayerData(payerCode);
    }
  }, [approvalForm, payerCode]);

  useEffect(() => {
    setPayerCode(paymentData?.unique_code || "");
    approvalForm.reset({
      unique_code: paymentData?.unique_code || "",
      amount: paymentData?.amount || 0,
      payment_date: paymentData?.payment_date || "",
      description: paymentData?.description || "",
      remission_period: paymentData?.remission_period ? paymentData?.remission_period || "" : "",
      division_id: paymentData?.division_id || "",
      chapter_id: paymentData?.chapter_id || "",

      is_converted: paymentData?.is_converted || false,
      conversion_description: paymentData?.conversion_description || "",
      conversion_amount: paymentData?.conversion_amount || 0,
      conversion_rate: paymentData?.conversion_rate || 0,
      conversion_currency: paymentData?.conversion_currency || "",
      conversion_time: paymentData?.conversion_time || "",
    });
  }, [paymentData]);

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {/* <div className="flex justify-end mb-6">
          <DialogTrigger asChild>
            <Button size={"lg"} variant="custom" className="w-full md:w-auto" onClick={() => setOpenDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Payment
            </Button>
          </DialogTrigger>
        </div> */}
        <DialogContent className="max-w-xl">
          {/* <DialogTitle></DialogTitle> */}
          <DialogTitle className="md:text-xl  font-semibold mb-4">Review Remission</DialogTitle>

          <Form {...approvalForm}>
            <div>
              <div className=" md:grid grid-cols-2 gap-3 space-y-3 md:space-y-0 mb-4 md:mt-0">
                <FormField
                  control={approvalForm.control}
                  name="unique_code"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90 font-normal dark:text-white text-base">Personal Code</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Input
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                          onChange={(e) => {
                            setPayerCode(e.target.value);
                            field.onChange(e);
                          }}
                          placeholder="XY-12345"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className={`text-[0.8rem] italic font-medium ${payerData?.user_name ? "text-primary" : "text-destructive"}`}>
                        {payerCode && (payerData?.user_name || "Unknown user")}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={approvalForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90 font-normal dark:text-white text-base">Amount</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <div className="flex gap-1">
                          {selectedChapterCurrecny && <Button type="button" variant="outline" className="max-w-max h-[44px] border-input dark:border-inputs">
                            {getCurrencySymbol(selectedChapterCurrecny)}
                          </Button>}
                          <Input
                            type="number"
                            min={0}
                            className="focus-visible:ring-0 dark:border-white/10 focus-visible:ring-offset-0"
                            {...field}
                            placeholder="e.g 100000"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" md:grid grid-cols-1 gap-3 space-y-3 md:space-y-0 mb-4 md:mt-0">
                <FormField
                  control={approvalForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90 font-normal dark:text-white text-base">Description</FormLabel>
                      </div>
                      <FormControl>
                        <Input className="focus-visible:ring-0 focus-visible:ring-offset-0" {...field} placeholder="Any useful details about the payment..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                <FormField
                  control={approvalForm.control}
                  name="division_id"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90 font-normal dark:text-white text-base">Division</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Select disabled onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select your Division" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {DivisionOptions.map((division: SelectOptions) => (
                              <SelectItem key={division.value} value={division.value as string}>
                                <div className="flex items-center cursor-pointer gap-3">
                                  <p>{division.name}</p>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={approvalForm.control}
                  name="chapter_id"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90 font-normal dark:text-white text-base">Chapter</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Select disabled onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select your Chapter" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {ChapterOptions.map((chapter: SelectOptions) => (
                              <SelectItem key={chapter.value} value={chapter.value as string}>
                                <div className="flex items-center cursor-pointer gap-3">
                                  <p>{chapter.name}</p>
                                </div>
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

              <div className=" md:grid grid-cols-2 gap-3 space-y-3 md:space-y-0 my-8 ">
                <FormField
                  control={approvalForm.control}
                  name="remission_period"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90  dark:text-white font-normal text-base">Remission Month</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <SelectTrigger className="shad-select-trigger">
                            <SelectValue placeholder="Select Payment Period" />
                          </SelectTrigger>
                          <SelectContent className="shad-select-content">
                            {RemissionPeriodsOptions.map((RemissionPeriod: SelectOptions) => (
                              <SelectItem key={RemissionPeriod.value} value={RemissionPeriod.value as string}>
                                <div className="flex items-center cursor-pointer gap-3">
                                  <p>{RemissionPeriod.name}</p>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={approvalForm.control}
                  name="payment_date"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormLabel className="text-gray-600/90 font-normal dark:text-white text-base">Payment Date</FormLabel>
                        <span className="text-red-500 text-base">*</span>
                        <FormTooltip text={"Day the remission was made"} />
                      </div>
                      <FormControl>
                        <div className="flex rounded-md border border-gray-500/20 items-center px-2">
                          <img className="mr-2" src="/icons/calendar.svg" height={24} width={24} alt="Calendar" />
                          <DatePicker
                            selected={field.value ? new Date(field.value) : null} // Convert string to Date
                            onChange={(date) => field.onChange(date ? dayjs(date).add(6, "hours").toISOString().split("T")[0] + "T12:00:00.000Z" : "")} // Convert Date back to string
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select the Payment Date"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            wrapperClassName="date-picker w-full"
                            className="border-0 outline-none bg w-full py-4"
                            minDate={new Date("2010-01-01")}
                            maxDate={new Date()}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="hidden bg-GGP-lightWight dark:bg-GGP-dark p-3 rounded-md my-1">
                <FormField
                  control={approvalForm.control}
                  name="is_converted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border py-1 px-3 shadow-sm m-1">
                      <div className="space-y-0.5">
                        <FormLabel>Currency Conversion</FormLabel>
                        <FormDescription>Is the remission made in a different currency?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} className=" data-[state=checked]:bg-GGP-darkGold" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {approvalForm.watch("is_converted") && (
                  <div className=" lg:grid grid-cols-3 gap-2 space-y-3 md:space-y-0">
                    <FormField
                      control={approvalForm.control}
                      name="conversion_currency"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-600/90 font-normal text-base">Conversion Currency</FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>

                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="shad-select-trigger bg-white">
                                <SelectValue placeholder="Select the Currency" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {WorldCurrenciesOptions.map((currency) => (
                                  <SelectItem key={currency.value} value={currency.value}>
                                    <div className="flex items-center cursor-pointer gap-3">
                                      <p>{currency.label}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={approvalForm.control}
                      name="conversion_amount"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-600/90 font-normal text-base">Conversion Amount</FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>
                          <FormControl>
                            <Input type="number" min={0} className="focus-visible:ring-0 focus-visible:ring-offset-0" {...field} placeholder="e.g 100000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={approvalForm.control}
                      name="conversion_rate"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-600/90 font-normal text-base">
                              Conversion Rate ({approvalForm.watch("conversion_currency")}/{chapterCurrency})
                            </FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              className="focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                              placeholder="e.g 1.25"
                              step=".001"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={approvalForm.control}
                      name="conversion_time"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-1">
                            <FormLabel className="text-gray-600/90 font-normal text-base">Conversion Date</FormLabel>
                            <span className="text-red-500 text-base">*</span>
                          </div>
                          <FormControl>
                            <div className="flex rounded-md border border-gray-500/20 items-center px-2 bg-white">
                              <img className="mr-2" src="/icons/calendar.svg" height={24} width={24} alt="Calendar" />
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null} // Convert string to Date
                                onChange={(date) => field.onChange(date ? dayjs(date).add(6, "hours").toISOString().split("T")[0] + "T12:00:00.000Z" : "")} // Convert Date back to string
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select the Conversion Date"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                wrapperClassName="date-picker w-full"
                                className="border-0 outline-none bg w-full py-4"
                                minDate={new Date("2010-01-01")}
                                maxDate={new Date()}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={approvalForm.control}
                      name="conversion_description"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-gray-600/90 font-normal text-base">Conversion Description</FormLabel>
                          <FormControl>
                            <Input
                              className="focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                              placeholder="Any useful details about the conversion..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                disabled={isPending}
                size={"lg"}
                className="w-full mt-4"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
              >
                Reject
              </Button>
              <Button disabled={isPending} size={"lg"} className="w-full mt-4" variant="custom" onClick={onSubmit}>
                Approve
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
