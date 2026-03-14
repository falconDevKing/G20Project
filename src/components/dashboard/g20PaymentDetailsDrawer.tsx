import { useState } from "react";
import dayjs from "dayjs";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { getFileUrl } from "@/services/storage";
import { updateG20Payment } from "@/services/g20Dashboard";
import type { G20PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
import { CapitaliseWords } from "@/lib/textUtils";
import { findChapterDetails, findDivisionDetails } from "@/services/payment";

type G20PaymentDetailsDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  payment: G20PaymentRowType | null;
  onPaymentUpdated?: () => Promise<void>;
};

const DefaultNA = <span className="text-muted-foreground">---</span>;

const formatValue = (value: any, key: string): React.ReactNode => {
  const dateFormat = key === "birth_day_mmdd" ? "DD-MMM" : key === "date_of_birth" ? "MMM DD" : key === "remission_period" ? "MMM YYYY" : "MMM DD, YYYY";
  const transformNationality = (nationality: string) => (nationality === "NG" ? "Nigerian" : "International");
  const valueToUse =
    key === "chapter_id"
      ? findChapterDetails(value).chapterName
      : key === "division_id"
        ? findDivisionDetails(value).divisionName
        : key === "nationality"
          ? transformNationality(value)
          : value;

  if (valueToUse === null || valueToUse === undefined || valueToUse === "") return DefaultNA;
  if (valueToUse instanceof Date || key.includes("date")) return dayjs(valueToUse).format(dateFormat);
  if (typeof valueToUse === "boolean") return valueToUse ? "Yes" : "No";
  if (Array.isArray(valueToUse)) return valueToUse.length ? valueToUse.join(", ") : DefaultNA;
  if (typeof valueToUse === "object") {
    // Fallback for nested objects
    return <pre className="text-xs bg-muted rounded p-2 overflow-x-auto">{JSON.stringify(valueToUse, null, 2)}</pre>;
  }
  return CapitaliseWords(String(valueToUse));
};

const titleise = (key: string) =>
  key
    .replace(/(_id|_|-)/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (s) => s.toUpperCase());

export const G20PaymentDetailsDrawer = ({ open, setOpen, payment, onPaymentUpdated }: G20PaymentDetailsDrawerProps) => {
  const [isRegeneratingUrl, setIsRegeneratingUrl] = useState(false);

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

  const regenerateReceiptUrl = async () => {
    try {
      if (!payment?.id || !payment?.proof_file_path) {
        ErrorHandler("No stored receipt file path available to generate a new URL.");
        return;
      }

      setIsRegeneratingUrl(true);
      const refreshedUrl = await getFileUrl(payment.proof_file_path);
      await updateG20Payment(payment.id, { receipt_url: refreshedUrl });

      payment.receipt_url = refreshedUrl;
      await onPaymentUpdated?.();
      SuccessHandler("New receipt URL generated.");
    } catch (error: any) {
      console.log("regenerateReceiptUrl error", error);
      ErrorHandler(error?.message || "Unable to generate new receipt URL.");
    } finally {
      setIsRegeneratingUrl(false);
    }
  };

  const keys = [
    "first_name",
    "last_name",
    "unique_code",
    "email",
    "payment_date",
    "amount",
    "currency",
    "division_id",
    "chapter_id",
    "status",
    "approved_by",
    "payment_channel",
    "description",
  ];
  type keysType = keyof typeof payment;
  const detailsData = keys.map((k) => [k, payment?.[k as keysType] || ""]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto dark:bg-[#13151B]">
        <SheetHeader>
          <SheetTitle className="text-[#1E1E1E] dark:text-white">Payment Details</SheetTitle>
        </SheetHeader>

        {payment ? (
          <div className="mt-4 space-y-4">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DetailCard label="User Name" value={`${payment.first_name || ""} ${payment.last_name || ""}`.trim()} />
              <DetailCard label="Unique Code" value={payment.unique_code || "-"} />
              <DetailCard label="Currency" value={payment.currency || "-"} />
              <DetailCard label="Amount" value={String(payment.amount || 0)} />
              <DetailCard label="Payment Date" value={dayjs(payment.payment_date).format("MMM DD, YYYY")} />
              <DetailCard label="Division" value={payment.division_id || "-"} />
              <DetailCard label="Chapter" value={payment.chapter_id || "-"} />
              <DetailCard label="Status" value={payment.status || "-"} />
              <DetailCard label="Approved By" value={payment.approved_by || "-"} />
              <DetailCard label="Channel" value={payment.payment_channel || "-"} />
            </div>


            <div className="rounded-xl border border-[#D6D6D6] dark:border-white/15 p-4 bg-white/40 dark:bg-[#1B1D24]">
              <div className="text-[#C9972D] text-sm font-medium">Description</div>
              <div className="text-[#1E1E1E] dark:text-gray-100 text-md leading-8 mt-2 break-words">{payment.description || "-"}</div>
            </div> */}

            <div className={`grid grid-cols-2 gap-4`}>
              {detailsData.map(([key, value]) => {
                const label = titleise(key);
                const rendered = formatValue(value, key);

                return (
                  <div
                    key={key}
                    className={`rounded-lg border dark:border-gray-500 p-2 ${["address", "description", "motivation"].includes(key) ? "col-span-2" : ""}`}
                  >
                    <div className="text-xs  font-bold   text-GGP-darkGold ">{label}</div>
                    <div className="mt-1 break-words dark:text-white">{rendered}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 pt-2 dark:text-white justify-between">
              {payment.receipt_url ? (
                <div className=" flex flex-wrap gap-2 ">
                  <Button variant="outline" onClick={openReceipt} className="border-G20-darkGold dark:text-G20-darkGold">
                    Open Receipt
                  </Button>
                  <Button variant="outline" onClick={downloadReceipt} className="border-G20-darkGold dark:text-G20-darkGold">
                    Download Receipt
                  </Button>
                </div>
              ) : null}

              <Button
                variant="outline"
                onClick={regenerateReceiptUrl}
                disabled={isRegeneratingUrl || !payment.proof_file_path}
                className="border-G20-darkGold dark:text-G20-darkGold"
              >
                {isRegeneratingUrl ? "Generating.." : "Generate New URL"}
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
