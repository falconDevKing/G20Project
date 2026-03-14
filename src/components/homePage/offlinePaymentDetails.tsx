import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import ZenithLogo from "../../assets/Zenith-Logo.png";
import { CopyIcon, CreditCard } from "lucide-react";
import CopyAction from "copy-to-clipboard";
import { SuccessHandler } from "@/lib/toastHandlers";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const OfflineBankDetails = ({
  showBg,
  squared,
  fullWidthOnMobile = false,
  className,
}: {
  showBg?: "gold" | "white";
  squared?: boolean;
  fullWidthOnMobile?: boolean;
  className?: string;
}) => {
  const [openOffline, setOpenOffline] = useState(false);

  return (
    <div className={cn(fullWidthOnMobile ? "w-full sm:w-auto" : "")}>
      <AlertDialog open={openOffline} onOpenChange={setOpenOffline}>
        <AlertDialogTrigger asChild className={"my-0"}>
          {squared ? (
            <Button
              size={"lg"}
              variant="custom"
              className={cn("w-full md:w-auto", fullWidthOnMobile ? "sm:w-auto" : "", className)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenOffline(true);
              }}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Make Payment
            </Button>
          ) : (
            <Button
              size={"lg"}
              variant="custom"
              className={cn(
                "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold gap-2 sm:text-md",
                showBg === "gold"
                  ? "border-[#8e6f2a] bg-[#c39a41] hover:bg-[#d2ab58] focus:ring-[#d2ab58]"
                  : showBg === "white"
                    ? "border-[#f8f1e3] bg-[#f8f1e3] text-[#1e170a] hover:bg-[#fffaf0]"
                    : "border border-[#c39a41] bg-[#182238] text-[#c39a41] hover:bg-[#202f4d] focus:ring-[#6d7fa8]",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0f1a]",
                fullWidthOnMobile ? "w-full sm:w-auto" : "",
                className,
              )}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenOffline(true);
              }}
            >
              Give Now
            </Button>
          )}
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-xl bg-white p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Use details below for easy payments</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="my-4 flex flex-col gap-4">
            <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-slate-200 px-4 py-5 text-center">
              <div>
                <img src={ZenithLogo} alt="Zenith Logo" className="h-[80px] w-auto" />
              </div>
              <div className="text-sm font-semibold text-slate-900">ZENITH BANK</div>
              <div className="text-sm font-medium text-slate-700">ISAIAH WEALTH MINISTRY G20</div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-slate-900">
                1016571032
                <span>
                  <CopyIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      CopyAction("1016571032");
                      SuccessHandler("Account Number copied successfully");
                    }}
                    size={16}
                  />
                </span>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <Button
              size={"lg"}
              className="w-full dark:bg-white hover:text-black"
              variant="outline2"
              type="button"
              onClick={() => {
                setOpenOffline(false);
              }}
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
