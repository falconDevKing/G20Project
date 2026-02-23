import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  // AlertDialogCancel,
} from "../ui/alert-dialog";
import MomoLogo from "../../assets/MoMo-Logo.png";
import ZenithLogo from "../../assets/Zenith-Logo.png";
import { CopyIcon } from "lucide-react";
import CopyAction from "copy-to-clipboard";
import { SuccessHandler } from "@/lib/toastHandlers";

interface GhanaBankDetailsProps {
  openGhana: boolean;
  setOpenGhana: (open: boolean) => void;
  setOpenDialog: (open: boolean) => void;
}

export const GhanaBankDetails = ({ openGhana, setOpenGhana, setOpenDialog }: GhanaBankDetailsProps) => {
  return (
    <div>
      <AlertDialog open={openGhana} onOpenChange={setOpenGhana}>
        <AlertDialogContent className="max-w-xl bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="">Use Details below for easy payments</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 my-4 flex">
            <div className="flex flex-col items-center gap-1 w-full">
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
            </div>

            <div className="flex flex-col items-center space-x-2 w-full gap-1">
              <div>
                <img src={ZenithLogo} alt="Zenith Logo" className="h-[80px] w-auto" />
              </div>
              <div>Zenith Bank Ghana</div>
              <div>Gospel Pillars Ministry</div>
              <div className="flex items-center">
                6010726395{" "}
                <span>
                  <CopyIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      CopyAction("6010726395");
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
                setOpenGhana(false);
                setOpenDialog(false);
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
