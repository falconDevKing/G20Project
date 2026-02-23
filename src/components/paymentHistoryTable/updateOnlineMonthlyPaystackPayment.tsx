import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RemissionDayOptions } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { fetchRecurringPayment, findChapterDetails, pauseMemberSubscriptionNotification, updateRecurringPayment } from "@/services/payment";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { getCurrencySymbol } from "@/lib/numberUtils";

interface UpdateOnlineMonthlyPaystackPaymentProps {
  filterData?: () => void;
  recurringPaymentId: string;
}

export const UpdateOnlineMonthlyPaystackPayment = ({ recurringPaymentId }: UpdateOnlineMonthlyPaystackPaymentProps) => {
  const user = useAppSelector((state) => state.auth.userDetails);

  const { paystack_monthly_payment_id, chapter_id, id: userId } = user;

  const correctUser = recurringPaymentId === paystack_monthly_payment_id;
  const [recurringPayment, setRecurringPayment] = useState<Record<string, any>>();
  const [updateState, setUpdateState] = useState("");
  const [newAmount, setNewAmount] = useState(0);
  const [remissionDay, setRemissionDay] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const isSubscriptionPaused = !recurringPayment?.active;
  const selectedChapterCurrecny = useMemo(() => findChapterDetails(chapter_id)?.currency, [chapter_id]);

  if (!correctUser) {
    ErrorHandler("Kindly refresh the page!");
  }

  const handleSubmit = async () => {
    switch (updateState) {
      case "Pause Automation": {
        //TODO: pause remission if usermigrates to a different currency
        try {
          setLoading(true);
          if (reason.trim().length < 1) {
            ErrorHandler("Please provide a reason for pausing the subscription");
            setLoading(false);
            return;
          }
          await pauseMemberSubscriptionNotification(userId, reason)
          setLoading(false);
          setOpenDialog(false);
        } catch (error: any) {
          ErrorHandler(error?.message || "Something went wrong");
          setLoading(false);
          return;
        }

        break;
      }
      case "Resume Automation": {
        try {
          setLoading(true);
          const updatedRecurringPayment = await updateRecurringPayment(recurringPaymentId, userId, { active: true });

          setRecurringPayment(updatedRecurringPayment);
          SuccessHandler("Recurring Payment Activated");
          setLoading(false);
          setOpenDialog(false);
        } catch (error: any) {
          ErrorHandler(error?.message || "Something went wrong");
          setLoading(false);
          return;
        }

        break;
      }
      case "Update Remission": {
        try {
          setLoading(true);
          const updatedRecurringPayment = await updateRecurringPayment(recurringPaymentId, userId, { amount: newAmount, charge_day: remissionDay });

          setRecurringPayment(updatedRecurringPayment);
          SuccessHandler("Recurring Payment Updated");
          setLoading(false);
          setOpenDialog(false);
        } catch (error: any) {
          ErrorHandler(error?.message || "Something went wrong");
          setLoading(false);
          return;
        }

        break;
      }

      default:
        break;
    }
  };

  useEffect(() => {
    const fetchRecurringPaymentCall = async (recurringPaymentId: string) => {
      try {
        const recurringPayment = await fetchRecurringPayment(recurringPaymentId);
        setRecurringPayment(recurringPayment);
      } catch (error: any) {
        console.log("error", error?.message, error);
        ErrorHandler("Unable to fetch subscription, " + error?.message);
        setOpenDialog(false);

        return;
      }
    };

    if (recurringPaymentId) {
      fetchRecurringPaymentCall(recurringPaymentId);
    }
  }, [recurringPaymentId]);

  return (
    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
      {/* <div className="flex justify-end mb-6"> */}
      <AlertDialogTrigger asChild>
        <div
          className="border border-[#CCA33D80] dark:bg-[#252525] dark:border-[#EDEDED24] w-full h-[135px] rounded-lg p-3 flex flex-col justify-between"
          style={{ cursor: "pointer" }}
        >
          <div className="flex items-center gap-x-3">
            <div className={"flex justify-center items-center w-10 h-10 rounded-full bg-GGP-darkGold"}>
              <Wallet size={20} className="text-GGP-lightGold" strokeWidth={2} />
            </div>
          </div>

          <div className="text-xl font-bold self-start md:self-auto">Manage Automated Remission</div>
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-xl bg-white p-6">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="text-xl font-bold self-start md:self-auto">Manage Automated Remissionx</div>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div>
          <RadioGroup onValueChange={setUpdateState} className="flex flex-wrap sm:flex-nowrap justify-between py-2 pb-4">
            {["Update Remission", `${isSubscriptionPaused ? "Resume" : "Pause"} Automation`].map((action) => (
              <div className={`flex w-full items-center space-x-2  p-3  rounded-lg ${updateState === action ? "bg-GGP-darkGold" : "border"}`} key={action}>
                <RadioGroupItem value={action} id={action} />
                <Label htmlFor={action} className={`text-lg ${updateState === action ? "text-white" : "text-black"}`}>
                  {action}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {updateState === "Pause Automation" && (
            <div className="my-2 flex gap-4 w-full">
              <div className="w-full">
                <div className="flex gap-1">
                  <Input
                    type="text"
                    min={0}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 "
                    placeholder="Reason for pausing remission"
                    allowDark={false}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

            </div>
          )}

          {updateState === "Update Remission" && (
            <div className="my-2 flex gap-4 w-full">
              <div className="w-full">
                <div className="py-2">New Remission Amount</div>
                <div className="flex gap-1">
                  {selectedChapterCurrecny && <Button type="button" variant="outline" className="max-w-max h-[44px] border-input bg-transparent">
                    {getCurrencySymbol(selectedChapterCurrecny)}
                  </Button>}
                  <Input
                    type="number"
                    min={0}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 "
                    placeholder="New Amount e.g 10000"
                    allowDark={false}
                    value={newAmount}
                    onChange={(e) => setNewAmount(+e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full">
                <div className="font-normal text-base py-2">Day for Subsequent Remissions</div>
                <Select onValueChange={setRemissionDay} value={remissionDay}>
                  <SelectTrigger className="shad-select-trigger" allowDark={false}>
                    <SelectValue placeholder="Select Preferred Payment Day" />
                  </SelectTrigger>
                  <SelectContent className="shad-select-content">
                    {RemissionDayOptions.map((RemissionDay: string) => (
                      <SelectItem key={RemissionDay} value={RemissionDay}>
                        <div className="flex items-center cursor-pointer gap-3">
                          <p>{RemissionDay}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11 rounded-md px-8 w-full dark:bg-white hover:text-black" type="button" disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <Button disabled={loading} size={"lg"} type="button" onClick={handleSubmit} className="w-full" variant="custom">
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
