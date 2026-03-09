import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { uploadData } from "aws-amplify/storage";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

import { useAppSelector } from "@/redux/hooks";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import { findChapterDetails } from "@/services/payment";
import { getFileUrl } from "@/services/storage";
import { createG20Payment } from "@/services/g20Dashboard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const g20OfflinePaymentSchema = z.object({
  amount: z.coerce.number().int().positive("Amount is required"),
  payment_date: z.string().min(1, "Payment date is required"),
  description: z.string().max(500).optional(),
  file: z.instanceof(File).optional(),
});

type G20OfflinePaymentFormValues = z.infer<typeof g20OfflinePaymentSchema>;

type G20LogOfflinePaymentProps = {
  onSaved: () => Promise<void>;
};

export const G20LogOfflinePayment = ({ onSaved }: G20LogOfflinePaymentProps) => {
  const user = useAppSelector((state) => state.auth.userDetails);
  const [openDialog, setOpenDialog] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { currency } = useMemo(() => findChapterDetails(user.chapter_id), [user.chapter_id]);

  const form = useForm<G20OfflinePaymentFormValues>({
    resolver: zodResolver(g20OfflinePaymentSchema),
    defaultValues: {
      amount: 0,
      payment_date: "",
      description: "",
      file: undefined,
    },
  });

  const onSubmit = async (values: G20OfflinePaymentFormValues) => {
    try {
      setIsPending(true);

      let proofFilePath: string | null = null;
      let receiptUrl: string | null = null;

      if (values.file) {
        const extension = values.file.name.split(".").pop() || "bin";
        const uniqueTag = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const uploadPath = `g20-payment-receipts/${user.id}/${uniqueTag}.${extension}`;

        const uploadedFile = await uploadData({
          path: uploadPath,
          data: values.file,
        }).result;

        proofFilePath = uploadedFile.path;
        receiptUrl = await getFileUrl(uploadedFile.path);
      }

      await createG20Payment({
        user_id: user.id,
        organisation_id: user.organisation_id,
        division_id: user.division_id,
        chapter_id: user.chapter_id,
        unique_code: user.unique_code,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        payment_date: values.payment_date,
        amount: values.amount,
        currency: currency || "NGN",
        status: "Pending",
        payment_channel: "transfer",
        description: values.description || null,
        proof_file_path: proofFilePath,
        receipt_url: receiptUrl,
      });

      await onSaved();
      SuccessHandler("Offline remission logged successfully.");
      setOpenDialog(false);
      form.reset();
    } catch (error: any) {
      console.log("g20 offline payment log error", error);
      ErrorHandler(error?.message || "Unable to log offline remission.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button size="lg" variant="custom" className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Log Offline Remission
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Log Offline Remission</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Unique Code</FormLabel>
              <FormControl>
                <Input disabled value={user.unique_code || ""} />
              </FormControl>
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} step={1} {...field} />
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
                    <FormLabel>Payment Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Payment Date"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        wrapperClassName="date-picker w-full"
                        className="border rounded-md w-full h-11 px-3"
                        minDate={new Date("2010-01-01")}
                        maxDate={new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Any useful details about this transfer" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receipt / Proof (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        field.onChange(file || undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant="custom" className="w-full" disabled={isPending}>
              {isPending ? "Saving.." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
