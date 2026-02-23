import { useEffect, useState } from "react";
import { Calendars, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onlinePaymentFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppSelector } from "@/redux/hooks";
import { findChapterDetails, getUserWithUniqueCode } from "@/services/payment";

import { MakeOnlinePaymentForm } from "./onlinePaymentForm";
import { MakeOnlineMonthlyPaymentForm } from "./onlineMonthlyPaymentForm";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { GhanaBankDetails } from "./showGhanaMomoDetails";

interface CombinedOnlinePaymentProps {
  filterData: () => void;
  forUser?: boolean;
  handleBankPopupClosed?: () => void;
}

type OnlinePaymentFormValues = z.infer<typeof onlinePaymentFormSchema>;

export const CombinedOnlinePayment = ({ filterData, handleBankPopupClosed }: CombinedOnlinePaymentProps) => {
  const user = useAppSelector((state) => state.auth.userDetails);

  const paystackSub = user?.paystack_monthly_payment_id;
  const hasSubscription = !![user?.subscription_ids].flat().filter(Boolean).length || !!paystackSub;

  const unique_code = user.unique_code;

  const [openDialog, setOpenDialog] = useState(false);
  const [openOneTime, setOpenOneTime] = useState(false);
  const [openMonthly, setOpenMonthly] = useState(false);
  const [openGhana, setOpenGhana] = useState(false);
  const [chapterCurrency, setChapterCurrency] = useState<string | null>(null);

  const [payerCode, setPayerCode] = useState(unique_code);

  const form = useForm<OnlinePaymentFormValues>({
    resolver: zodResolver(onlinePaymentFormSchema),
    defaultValues: {
      unique_code: unique_code,
      amount: 0,
      description: "",
      remission_period: "",
      chapter_id: "",
      division_id: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const fetchPayerData = async (unique_code: string) => {
      const payerData = await getUserWithUniqueCode(unique_code);

      const { chapter_id, division_id } = payerData;

      form.setValue("division_id", division_id);
      form.setValue("chapter_id", chapter_id);

      const chapterCurrency = findChapterDetails(chapter_id)?.currency;
      setChapterCurrency(chapterCurrency);
    };

    if (payerCode) {
      fetchPayerData(payerCode);
    }
  }, [form, payerCode, openDialog]);

  useEffect(() => {
    if (unique_code) {
      setPayerCode(unique_code);
    }
  }, [unique_code]);

  useEffect(() => {
    setTimeout(() => {
      filterData();
    }, 1500);
  }, [openDialog, openOneTime, openMonthly]);

  return (
    <div>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <div className="flex justify-end mb-6">
          <AlertDialogTrigger asChild className="my-2 xl:my-0">
            <Button
              size={"lg"}
              variant="custom"
              className="w-full md:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                chapterCurrency === "GHS" ? setOpenGhana(true) : hasSubscription ? setOpenOneTime(true) : setOpenDialog(true);
              }}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Make Payment
            </Button>
          </AlertDialogTrigger>
        </div>

        <AlertDialogContent className="max-w-xl bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Choose Preferred Payment Mode</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="w-full flex flex-col md:flex-row flex-wrap justify-evenly gap-2 pt-4">
            <Button
              size={"lg"}
              variant="custom"
              className="w-full md:w-auto min-w-70"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenOneTime(true);
              }}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Make One Time Payment
            </Button>

            <Button
              size={"lg"}
              variant="custom"
              className="w-full md:w-auto min-w-70"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenMonthly(true);
              }}
            >
              <Calendars className="w-4 h-4 mr-2" />
              Automate Monthly Remissions
            </Button>
          </div>

          <AlertDialogFooter>
            <Button size={"lg"} className="w-full dark:bg-white hover:text-black" variant="outline2" type="button" onClick={() => setOpenDialog(false)}>
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MakeOnlinePaymentForm
        filterData={filterData}
        forUser
        handleBankPopupClosed={handleBankPopupClosed}
        openOneTime={openOneTime}
        setOpenOneTime={setOpenOneTime}
        setOpenDialog={setOpenDialog}
      />

      <MakeOnlineMonthlyPaymentForm
        filterData={filterData}
        handleBankPopupClosed={handleBankPopupClosed}
        openMonthly={openMonthly}
        setOpenMonthly={setOpenMonthly}
        setOpenDialog={setOpenDialog}
      />

      <GhanaBankDetails openGhana={openGhana} setOpenGhana={setOpenGhana} setOpenDialog={setOpenDialog} />
    </div>
  );
};
