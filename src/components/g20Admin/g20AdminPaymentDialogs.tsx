import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import { Plus, ExternalLink, Download } from "lucide-react";
import { uploadData } from "aws-amplify/storage";

import SupabaseClient from "@/supabase/supabaseConnection";
import { useAppSelector } from "@/redux/hooks";
import type { G20PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
import { createG20Payment, updateG20Payment } from "@/services/g20Dashboard";
import { getFileUrl } from "@/services/storage";
import { findChapterDetails } from "@/services/payment";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const paymentEntrySchema = z.object({
  unique_code: z.string().min(1, "Personal code is required"),
  amount: z.coerce.number().int().positive("Amount is required"),
  description: z.string().max(500).optional(),
  payment_date: z.string().min(1, "Payment date is required"),
  file: z.instanceof(File).optional(),
});

type PaymentEntryFormValues = z.infer<typeof paymentEntrySchema>;

type G20AdminPaymentEntryDialogProps = {
  mode: "paid" | "pending";
  onSaved: () => Promise<void>;
};

const paidLikeStatuses = new Set(["paid", "cleared", "approved", "setup"]);

export const G20AdminPaymentEntryDialog = ({ mode, onSaved }: G20AdminPaymentEntryDialogProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const user = useAppSelector((state) => state.auth.userDetails);

  const form = useForm<PaymentEntryFormValues>({
    resolver: zodResolver(paymentEntrySchema),
    defaultValues: {
      unique_code: "",
      amount: 0,
      description: "",
      payment_date: "",
      file: undefined,
    },
  });

  const partnerCode = form.watch("unique_code");

  useEffect(() => {
    const resolvePartner = async () => {
      if (!partnerCode) {
        setPartnerName("");
        return;
      }

      const { data } = await SupabaseClient.from("partner").select("first_name,last_name").eq("unique_code", partnerCode).maybeSingle();

      setPartnerName(data ? `${data.first_name || ""} ${data.last_name || ""}`.trim() : "");
    };

    resolvePartner();
  }, [partnerCode]);

  const onSubmit = async (values: PaymentEntryFormValues) => {
    try {
      setIsPending(true);

      const { data: partner, error: partnerError } = await SupabaseClient.from("partner")
        .select("id,unique_code,organisation_id,division_id,chapter_id,shepherd_id,governor_id,president_id,email,first_name,last_name")
        .eq("unique_code", values.unique_code)
        .maybeSingle();

      if (partnerError || !partner) {
        throw new Error("Honourable not found for the supplied personal code.");
      }

      const { currency } = findChapterDetails(partner.chapter_id);

      let proofFilePath: string | null = null;
      let receiptUrl: string | null = null;

      if (values.file) {
        const extension = values.file.name.split(".").pop() || "bin";
        const uniqueTag = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const uploadPath = `g20-payment-receipts/${partner.id}/${uniqueTag}.${extension}`;

        const uploadedFile = await uploadData({
          path: uploadPath,
          data: values.file,
        }).result;

        proofFilePath = uploadedFile.path;
        receiptUrl = await getFileUrl(uploadedFile.path);
      }

      const isPaid = mode === "paid";
      const approverName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

      await createG20Payment({
        user_id: partner.id,
        organisation_id: partner.organisation_id,
        division_id: partner.division_id,
        chapter_id: partner.chapter_id,
        shepherd_id: partner.shepherd_id,
        governor_id: partner.governor_id,
        president_id: partner.president_id,
        unique_code: partner.unique_code,
        email: partner.email,
        first_name: partner.first_name,
        last_name: partner.last_name,
        payment_date: values.payment_date,
        amount: values.amount,
        currency: currency || "NGN",
        status: isPaid ? "Paid" : "Pending",
        payment_channel: "transfer",
        description: values.description || null,
        proof_file_path: proofFilePath,
        receipt_url: receiptUrl,
        approved_by: isPaid ? approverName : null,
        approved_by_id: isPaid ? user.id : null,
        approved_by_image: isPaid ? user.image_url : null,
      });

      await onSaved();
      SuccessHandler(isPaid ? "Payment recorded successfully." : "Offline remission logged successfully.");
      setOpenDialog(false);
      form.reset();
      setPartnerName("");
    } catch (error: any) {
      console.log("g20 admin payment entry error", error);
      ErrorHandler(error?.message || "Unable to save payment.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button size="lg" variant="custom" className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          {mode === "paid" ? "Add New Payment" : "Log Offline Remission"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogTitle>{mode === "paid" ? "Add New Payment" : "Log Offline Remission"}</DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="unique_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="XY-12345" className="dark:border-white/60" />
                  </FormControl>
                  <FormMessage />
                  <div className={`text-[0.8rem] italic font-medium ${partnerName ? "text-primary" : "text-destructive"}`}>
                    {field.value ? partnerName || "Unknown user" : ""}
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} step={1} {...field} className="dark:border-white/60" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} placeholder="Any useful details about the payment" className="dark:border-white/60" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="payment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date</FormLabel>
                    <FormControl>
                      <div className="flex rounded-md border border-gray-500/20 dark:border-white/60 items-center px-2">
                        <img className="mr-2" src="/icons/calendar.svg" height={24} width={24} alt="Calendar" />
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select Payment Date"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          wrapperClassName="date-picker w-full"
                          className="border-0 outline-none w-full py-3 dark:bg-transparent dark:text-white"
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
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Receipt</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          field.onChange(file || undefined);
                        }}
                        className="dark:border-white/60 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" variant="custom" className="w-full" disabled={isPending}>
              {isPending ? "Saving.." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

type G20ApprovePaymentDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  payment: G20PaymentRowType | null;
  onSaved: () => Promise<void>;
};

export const G20ApprovePaymentDialog = ({ open, setOpen, payment, onSaved }: G20ApprovePaymentDialogProps) => {
  const user = useAppSelector((state) => state.auth.userDetails);
  const [isPending, setIsPending] = useState(false);
  const [partnerName, setPartnerName] = useState("");

  const form = useForm<PaymentEntryFormValues>({
    resolver: zodResolver(paymentEntrySchema),
    defaultValues: {
      unique_code: payment?.unique_code || "",
      amount: Number(payment?.amount || 0),
      description: payment?.description || "",
      payment_date: payment?.payment_date || "",
      file: undefined,
    },
  });

  useEffect(() => {
    form.reset({
      unique_code: payment?.unique_code || "",
      amount: Number(payment?.amount || 0),
      description: payment?.description || "",
      payment_date: payment?.payment_date || "",
      file: undefined,
    });
  }, [payment, form]);

  const partnerCode = form.watch("unique_code");

  useEffect(() => {
    const resolvePartner = async () => {
      if (!partnerCode) {
        setPartnerName("");
        return;
      }

      const { data } = await SupabaseClient.from("partner").select("first_name,last_name").eq("unique_code", partnerCode).maybeSingle();

      setPartnerName(data ? `${data.first_name || ""} ${data.last_name || ""}`.trim() : "");
    };

    resolvePartner();
  }, [partnerCode]);

  const currentStatus = String(payment?.status || "").toLowerCase();
  const canApprove = !paidLikeStatuses.has(currentStatus) && currentStatus !== "cancelled";

  const openReceipt = () => {
    if (payment?.receipt_url) {
      window.open(payment.receipt_url, "_blank", "noopener,noreferrer");
    }
  };

  const downloadReceipt = () => {
    if (!payment?.receipt_url) {
      return;
    }
    const link = document.createElement("a");
    link.href = payment.receipt_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = "g20-receipt";
    link.click();
  };

  const saveWithStatus = async (status: "Paid" | "Cancelled") => {
    try {
      if (!payment?.id) return;
      setIsPending(true);
      const values = form.getValues();

      const { data: partner, error: partnerError } = await SupabaseClient.from("partner")
        .select("id,unique_code,organisation_id,division_id,chapter_id,shepherd_id,governor_id,president_id,email,first_name,last_name")
        .eq("unique_code", values.unique_code)
        .maybeSingle();

      if (partnerError || !partner) {
        throw new Error("Honourable not found for the supplied personal code.");
      }

      let proofFilePath = payment?.proof_file_path || null;
      let receiptUrl = payment?.receipt_url || null;

      if (values.file) {
        const extension = values.file.name.split(".").pop() || "bin";
        const uniqueTag = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const uploadPath = `g20-payment-receipts/${partner.id}/${uniqueTag}.${extension}`;

        const uploadedFile = await uploadData({
          path: uploadPath,
          data: values.file,
        }).result;

        proofFilePath = uploadedFile.path;
        receiptUrl = await getFileUrl(uploadedFile.path);
      }

      const approverName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      const { currency } = findChapterDetails(partner.chapter_id);

      await updateG20Payment(payment.id, {
        user_id: partner.id,
        organisation_id: partner.organisation_id,
        division_id: partner.division_id,
        chapter_id: partner.chapter_id,
        shepherd_id: partner.shepherd_id,
        governor_id: partner.governor_id,
        president_id: partner.president_id,
        unique_code: partner.unique_code,
        email: partner.email,
        first_name: partner.first_name,
        last_name: partner.last_name,
        currency: currency || payment.currency || "NGN",
        amount: values.amount,
        payment_date: values.payment_date,
        description: values.description || null,
        proof_file_path: proofFilePath,
        receipt_url: receiptUrl,
        payment_channel: payment.payment_channel || "transfer",
        status,
        approved_by: status === "Paid" ? approverName : null,
        approved_by_id: status === "Paid" ? user.id : null,
        approved_by_image: status === "Paid" ? user.image_url || null : null,
      });
      await onSaved();
      SuccessHandler(status === "Paid" ? "Remission approved." : "Remission rejected.");
      setOpen(false);
    } catch (error: any) {
      console.log("g20 review payment error", error);
      ErrorHandler(error?.message || "Unable to update remission.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogTitle>Review Remission</DialogTitle>

        {payment ? (
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="unique_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="XY-12345" className="dark:border-white/60" />
                    </FormControl>
                    <FormMessage />
                    <div className={`text-[0.8rem] italic font-medium ${partnerName ? "text-primary" : "text-destructive"}`}>
                      {field.value ? partnerName || "Unknown user" : ""}
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} step={1} {...field} className="dark:border-white/60" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Any useful details about the payment" className="dark:border-white/60" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                <FormField
                  control={form.control}
                  name="payment_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Date</FormLabel>
                      <FormControl>
                        <div className="flex rounded-md border border-gray-500/20 dark:border-white/60 items-center px-2">
                          <img className="mr-2" src="/icons/calendar.svg" height={24} width={24} alt="Calendar" />
                          <DatePicker
                            selected={field.value ? new Date(field.value) : null}
                            onChange={(date) => field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select Payment Date"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            wrapperClassName="date-picker w-full"
                            className="border-0 outline-none w-full py-3 dark:bg-transparent dark:text-white"
                            minDate={new Date("2010-01-01")}
                            maxDate={new Date()}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pb-1">
                  {payment.receipt_url ? (
                    <>
                      <Button type="button" variant="outline" size="sm" onClick={openReceipt}>
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={downloadReceipt}>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>

              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Receipt (replace optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          field.onChange(file || undefined);
                        }}
                        className="dark:border-white/60 dark:text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button type="button" variant="destructive" className="w-full" onClick={() => saveWithStatus("Cancelled")} disabled={isPending || !canApprove}>
                  Reject
                </Button>
                <Button type="button" variant="custom" className="w-full" onClick={() => saveWithStatus("Paid")} disabled={isPending || !canApprove}>
                  Approve
                </Button>
              </div>
            </form>
          </Form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
