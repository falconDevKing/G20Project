import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DatePicker from "react-datepicker";
import { paymentFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { initialiseOptions} from "@/lib/utils";
// import { initialiseOptions, RemissionPeriodsOptions } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import dayjs from "dayjs";
import { findChapterDetails, getUserWithUniqueCode, initialPayerData, type PayerDataType, makePayment, findDivisionDetails } from "@/services/payment";
import { SelectOptions } from "@/interfaces/register";
// import { Switch } from "@/components/ui/switch";
// import { WorldCurrenciesOptions } from "@/constants/currencies";
import FormTooltip from "../FormTooltips";
import { DummyObject } from "@/interfaces/tools";
import FetchGBPExchangeRatesValue from "@/lib/fetchGBPExchangeRatesValue";
import { getCurrencySymbol } from "@/lib/numberUtils";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import { FileUpload } from "../FileUpload";

type postLogPaymentProcessingType = {
  user_name: string;
  currency: string;
  amount: number;
  remission_period: string;
  payment_date: string;
  chapterName: string;
  payerDataUser_id: string;
  userId: string;
  chapterReps: DummyObject[];
};

interface LogPaymentProps {
  filterData: () => void;
  forUser?: boolean;
  postLogPaymentProcessing: (postLogPaymentProcessingData: postLogPaymentProcessingType) => Promise<void>;
}

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const LogPayment = ({ forUser = false, postLogPaymentProcessing }: LogPaymentProps) => {
  const appState = useAppSelector((state) => state.app);
  const user = useAppSelector((state) => state.auth.userDetails);

  const { chapter_id, division_id, permission_type } = user;
  const unique_code = user.unique_code;

  const { AppOrganisationId, DivisionOptions, ChapterOptions } = initialiseOptions(appState);

  const [isPending, setIsPending] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chapterCurrency, setChapterCurrency] = useState("");
  const [payerCode, setPayerCode] = useState(unique_code);
  const [payerData, setPayerData] = useState<PayerDataType>(initialPayerData);

  const isIndividual = permission_type === "individual";

  console.log('chapterCurrency', chapterCurrency)
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      unique_code: isIndividual || forUser ? unique_code : "",
      amount: 0,
      payment_date: "",
      description: "",
      remission_period: "",
      division_id: division_id || "",
      chapter_id: chapter_id || "",

      proof_of_payment: "",
    },
  });

  const selectedChapterId = form.watch("chapter_id");
  const selectedChapterCurrecny = useMemo(() => findChapterDetails(selectedChapterId)?.currency, [selectedChapterId]);

  const onSubmit = async (values: PaymentFormValues) => {
    try {
      setIsPending(true);

      if (!payerData.user_name) {
        ErrorHandler("CanT find User");
        return;
      }

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

      const { currency, chapterName, chapterReps } = findChapterDetails(chapter_id);
      const { divisionReps } = findDivisionDetails(division_id);

      const rate = await FetchGBPExchangeRatesValue(currency);

      const user_name = payerData.user_name;

      const newEntry = {
        unique_code: unique_code,
        currency,
        amount: +amount,
        payment_date: payment_date,
        remission_month: remission_period.split(" ")[0],
        remission_year: remission_period.split(" ")[1],
        remission_period,
        status: "Pending",
        user_name,
        description,
        gbp_equivalent: +amount / +(rate || 1),

        organisation_id: AppOrganisationId,
        division_id,
        chapter_id,
        user_id: payerData.user_id,
        ...conversionData,
      };

      await makePayment(newEntry, true);

      const combinedReps = [...(chapterReps as DummyObject[]), ...(divisionReps as DummyObject[])];

      postLogPaymentProcessing({
        user_name,
        currency,
        amount,
        remission_period,
        payment_date,
        chapterName,
        payerDataUser_id: payerData.user_id,
        userId: user.id,
        chapterReps: forUser ? combinedReps : (divisionReps as DummyObject[]),
      });

      form.reset();
      setOpenDialog(false);
      SuccessHandler("Payment Logged Successfully");
    } catch (error) {
      console.log("register error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    const fetchPayerData = async (unique_code: string) => {
      const payerData = await getUserWithUniqueCode(unique_code);

      const { division_id, chapter_id } = payerData;
      form.setValue("division_id", division_id);
      form.setValue("chapter_id", chapter_id);
      const { currency } = findChapterDetails(chapter_id);
      setChapterCurrency(currency);
      setPayerData(payerData);
    };

    if (payerCode) {
      fetchPayerData(payerCode);
    }
  }, [form, payerCode]);

  useEffect(() => {
    if (unique_code) {
      setPayerCode(unique_code);
    }
  }, [unique_code]);

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <div className="flex justify-end mb-6">
          <DialogTrigger asChild className="my-2 xl:my-0">
            <Button size={"lg"} variant="custom" className="w-full md:w-auto" onClick={() => setOpenDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Log {forUser ? "your" : "an"} Offline remission
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="max-w-xl">
          <h2 className="md:text-xl  font-semibold mb-4">Log Remission Record</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className=" md:grid grid-cols-2 gap-3 space-y-3 md:space-y-0 mb-4 md:mt-0">
                  <FormField
                    control={form.control}
                    name="unique_code"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1">
                          <FormLabel className="text-gray-600/90 dark:text-white font-normal text-base">Personal Code</FormLabel>
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
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1">
                          <FormLabel className="text-gray-600/90 font-normal dark:text-white text-base">Amount</FormLabel>
                          <span className="text-red-500 text-base">*</span>
                        </div>
                        <FormControl>
                          <div className="flex gap-1">
                            {selectedChapterCurrecny && (
                              <Button type="button" variant="outline" className="max-w-max h-[44px] border-input dark:border-inputs">
                                {getCurrencySymbol(selectedChapterCurrecny)}
                              </Button>
                            )}
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

                <div className=" md:grid grid-cols-2 gap-3 space-y-3 md:space-y-0 mb-4 md:mt-0">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1">
                          <FormLabel className="text-gray-600/90 dark:text-white  font-normal text-base">Description</FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                            placeholder="Any useful details about the payment..."
                            maxLength={96}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payment_date"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1">
                          <FormLabel className="text-gray-600/90 dark:text-white  font-normal text-base">Payment Date</FormLabel>
                          <span className="text-red-500 text-base">*</span>
                          <FormTooltip text={"Day you made the remission"} />
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

                <div className=" lg:grid grid-cols-2 gap-2 space-y-3 md:space-y-0">
                  <FormField
                    control={form.control}
                    name="division_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1">
                          <FormLabel className="text-gray-600/90 font-normal  dark:text-white text-base">Division</FormLabel>
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
                    control={form.control}
                    name="chapter_id"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1">
                          <FormLabel className="text-gray-600/90  dark:text-white font-normal text-base">Chapter</FormLabel>
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

                <div className=" md:grid grid-cols-1 gap-3 space-y-3 md:space-y-0 my-8 ">
                  <FormField
                    control={form.control}
                    name="proof_of_payment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-gray-700/90 dark:text-gray-300/90 font-normal text-base">Proof of Payment</FormLabel>

                        <FormControl>
                          <FileUpload user_id={user.id} filePath={field.value} onChange={field.onChange} size="small" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button disabled={isPending} size={"lg"} type="submit" className="w-full mt-4" variant="custom">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
