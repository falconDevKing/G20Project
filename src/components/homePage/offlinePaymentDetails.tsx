import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogTrigger,
  // AlertDialogCancel,
} from "../ui/alert-dialog";
// import MomoLogo from "../../assets/MoMo-Logo.png";
import ZenithLogo from "../../assets/Zenith-Logo.png";
import { CopyIcon, CreditCard } from "lucide-react";
import CopyAction from "copy-to-clipboard";
import { SuccessHandler } from "@/lib/toastHandlers";
import { useState } from "react";
import { cn } from "@/lib/utils";
// import { GhostButton } from "../customIcons";

export const OfflineBankDetails = ({ showBg, squared }: { showBg?: "gold" | "white"; squared?: boolean }) => {
  const [openOffline, setOpenOffline] = useState(false);

  return (
    <div>
      <AlertDialog open={openOffline} onOpenChange={setOpenOffline}>
        <AlertDialogTrigger asChild className="my-2 xl:my-0">
          {squared ? (
            <Button
              size={"lg"}
              variant="custom"
              className="w-full md:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenOffline(true);
              }}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Make Payment
            </Button>
          ) : (
            <Button
              size={"lg"}
              variant="custom"
              className={cn(
                "inline-flex items-center justify-center rounded-full px-6 py-3 text-md font-semibold gap-2",
                showBg === "gold"
                  ? "border-[#8e6f2a] bg-[#c39a41] hover:bg-[#d2ab58] focus:ring-[#d2ab58]"
                  : showBg === "white"
                    ? "border-[#f8f1e3] bg-[#f8f1e3] text-[#1e170a] hover:bg-[#fffaf0]"
                    : "border border-[#c39a41] bg-[#182238] text-[#c39a41] hover:bg-[#202f4d] focus:ring-[#6d7fa8]",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0f1a]",
              )}
              // className="w-full md:w-auto bg-white  text-GGP-darkGold text-lg hover:text-white hover:bg-GGP-darkGold hover:border-white border-2"

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

        <AlertDialogContent className="max-w-xl bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="">Use Details below for easy payments</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 my-4 flex">
            {/* <div className="flex flex-col items-center gap-1 w-full">
              <div className="mt-4">
                <img src={MomoLogo} alt="Momo Logo" className="h-[80px] w-auto" />
              </div>
              <div>MOMO </div>
              <div>Transfer Details </div>
              <div className="flex items-center gap-1">
                0539764426{" "}
                <span>
                  <CopyIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      CopyAction("0539764426");
                      SuccessHandler(`Account Number copied successfully`);
                    }}
                    size={16}
                  />
                </span>
              </div>
            </div> */}

            <div className="flex flex-col items-center space-x-2 w-full gap-1">
              <div>
                <img src={ZenithLogo} alt="Zenith Logo" className="h-[80px] w-auto" />
              </div>
              <div>ZENITH BANK</div>
              <div>ISAIAH WEALTH MINISTRY G20</div>
              <div className="flex items-center">
                1016571032{" "}
                <span>
                  <CopyIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      CopyAction("1016571032");
                      SuccessHandler(`Account Number copied successfully`);
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
