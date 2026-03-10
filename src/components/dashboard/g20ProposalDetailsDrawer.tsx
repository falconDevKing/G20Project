import { useState } from "react";
import dayjs from "dayjs";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import { CapitaliseWords } from "@/lib/textUtils";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import { findChapterDetails, findDivisionDetails } from "@/services/payment";
import { updateProposedScheduleRow } from "@/services/g20Dashboard";
import type { ProposedPaymentScheduleRowType } from "@/supabase/modifiedSupabaseTypes";

type G20ProposalDetailsDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  proposal: ProposedPaymentScheduleRowType | null;
  onProposalUpdated?: () => Promise<void>;
};

const DefaultNA = <span className="text-muted-foreground">---</span>;

const formatValue = (value: any, key: string): React.ReactNode => {
  const dateFormat = key === "proposed_date" ? "MMM DD, YYYY" : "MMM DD, YYYY";
  const valueToUse =
    key === "chapter_id"
      ? findChapterDetails(String(value || "")).chapterName
      : key === "division_id"
        ? findDivisionDetails(String(value || "")).divisionName
        : value;

  if (valueToUse === null || valueToUse === undefined || valueToUse === "") return DefaultNA;
  if (key === "status" && typeof valueToUse === "string") return CapitaliseWords(valueToUse);
  if (valueToUse instanceof Date || key.includes("date")) return dayjs(valueToUse).format(dateFormat);
  if (typeof valueToUse === "boolean") return valueToUse ? "Yes" : "No";
  if (Array.isArray(valueToUse)) return valueToUse.length ? valueToUse.join(", ") : DefaultNA;
  if (typeof valueToUse === "object") {
    return <pre className="text-xs bg-muted rounded p-2 overflow-x-auto">{JSON.stringify(valueToUse, null, 2)}</pre>;
  }
  return CapitaliseWords(String(valueToUse));
};

const titleise = (key: string) =>
  key
    .replace(/(_id|_|-)/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (s) => s.toUpperCase());

export const G20ProposalDetailsDrawer = ({ open, setOpen, proposal, onProposalUpdated }: G20ProposalDetailsDrawerProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const isCleared = String(proposal?.status || "").toLowerCase() === "cleared";

  const markAsCleared = async () => {
    try {
      if (!proposal?.id || isCleared) {
        return;
      }

      setIsUpdating(true);
      await updateProposedScheduleRow(proposal.id, { status: "cleared" });
      await onProposalUpdated?.();
      SuccessHandler("Proposal marked as cleared.");
      setOpen(false);
    } catch (error: any) {
      console.log("markAsCleared error", error);
      ErrorHandler(error?.message || "Unable to mark proposal as cleared.");
    } finally {
      setIsUpdating(false);
    }
  };

  const detailsData: Array<[string, string | number | null | undefined]> = [
    ["user_name", `${proposal?.first_name || ""} ${proposal?.last_name || ""}`.trim()],
    ["unique_code", proposal?.unique_code],
    ["email", proposal?.email],
    ["proposed_amount", proposal?.proposed_amount],
    ["schedule_year", proposal?.schedule_year],
    ["proposed_date", proposal?.proposed_date],
    ["schedule_index", proposal?.schedule_index],
    ["division_id", proposal?.division_id],
    ["chapter_id", proposal?.chapter_id],
    ["status", proposal?.status],
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto dark:bg-[#13151B]">
        <SheetHeader>
          <SheetTitle className="text-[#1E1E1E] dark:text-white">Proposal Details</SheetTitle>
        </SheetHeader>

        {proposal ? (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {detailsData.map(([key, value]) => {
                const keyText = String(key);
                const label = titleise(keyText);
                const rendered =
                  keyText === "proposed_amount"
                    ? numberWithCurrencyFormatter(
                        proposal?.currency || findChapterDetails(proposal?.chapter_id || "").currency || "NGN",
                        Number(proposal?.proposed_amount || 0),
                      )
                    : formatValue(value, keyText);

                return (
                  <div key={keyText} className="rounded-lg border dark:border-gray-500 p-2">
                    <div className="text-xs font-bold text-GGP-darkGold">{label}</div>
                    <div className="mt-1 break-words dark:text-white">{rendered}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 pt-2 dark:text-white">
              <Button variant="custom" onClick={markAsCleared} disabled={isUpdating || isCleared}>
                {isUpdating ? "Updating.." : isCleared ? "Already Cleared" : "Mark as Cleared"}
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
