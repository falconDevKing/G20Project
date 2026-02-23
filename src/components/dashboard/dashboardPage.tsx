// import { useState } from "react";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { ContainerFluid } from "../containerFluid";
import { AlertCircle, CircleAlert, CircleCheckBig, CircleDashed } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import dayjs from "dayjs";
import { getPaidMonths, monthsOfTheYear, cn, getDashboardSummary } from "@/lib/utils";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import { findChapterDetails } from "@/services/payment";
import { MakeOnlineMonthlyPayment } from "../paymentHistoryTable/makeOnlineMonthlyPayment";
import { getUserPayments } from "@/redux/paymentSlice";
import { UpdateOnlineMonthlyStripePayment } from "../paymentHistoryTable/updateOnlineMonthlyStripePayment";
import { UpdateOnlineMonthlyPaystackPayment } from "../paymentHistoryTable/updateOnlineMonthlyPaystackPayment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectOptions } from "@/interfaces/register";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router";

export default function DashboardCom() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.userDetails);
  const userPayments = useAppSelector((state) => state.payment.userPayments);
  const currentYear = dayjs().format("YYYY");
  const [trackingYear, setTrackingYear] = useState<string>(currentYear);
  const paidMonths = getPaidMonths(userPayments, trackingYear);
  const userRemissionStartDate = user.remission_start_date;
  const remissionStartMonth = userRemissionStartDate && dayjs(userRemissionStartDate).year() === dayjs().year() ? dayjs(userRemissionStartDate).month() : 0;
  const remissionStartYear = userRemissionStartDate && dayjs(userRemissionStartDate).year();
  const summary = getDashboardSummary(userPayments, remissionStartMonth);
  const currentMonthIndex = +dayjs().format("M") - 1;
  const { currency } = findChapterDetails(user.chapter_id);
  const paystackSub = user?.paystack_monthly_payment_id;
  const hasSubscription = !![user?.subscription_ids].flat().filter(Boolean).length || !!paystackSub;
  // const hasSubscription = !!user?.paystack_monthly_payment_id;
  const latestSubscription = user?.subscription_ids?.[user?.subscription_ids?.length - 1];
  const since2025YearsOptions = Array.from({ length: +currentYear + 1 - 2025 }, (_, i) => +currentYear - i).map((year) => ({
    name: year.toString(),
    value: year.toString(),
  }));

  const permission_type = user.permission_type;
  const isAdmin = ["chapter", "division", "organisation"].includes(permission_type || "");

  const filterData = () => {
    dispatch(getUserPayments());
  };

  const metrics = [
    {
      title: "Total Payments Remitted",
      value: summary.noOfPaymentsMade,
      icon: <CircleCheckBig size={20} className="text-[#039855]" strokeWidth={2} />,
    },
    {
      title: "Total Payments Missed",
      value: summary.paymentsMonthsMissed,
      icon: <AlertCircle className="text-[#D92D20]" size={20} strokeWidth={2} />,
    },
    {
      title: "Total Amount Remitted",
      value: numberWithCurrencyFormatter(currency || "GBP", summary.totalPaymentAmount),
      icon: <CircleCheckBig size={20} className="text-[#039855]" strokeWidth={2} />,
    },
  ];

  const timeoutRef = useRef<number | null>(null);

  const handleBankPopupClosed = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      dispatch(getUserPayments());
    }, 7_000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ContainerFluid>
      <div>
        <div className="flex flex-col md:flex-row md:justify-between gap-x-2">
          <div>
            <div className="pt-2 text-2xl lg:text-3xl font-bold dark:text-GGP-darkGold">Welcome, {user.first_name}.</div>
            <p className="max-w-[530px] mb-4 font-light text-base dark:text-white text-GGP-dark/75">
              Thank you for your commitment towards your partnership. Below is the summary of your remissions.
            </p>
          </div>

          {isAdmin ? (
            <div className=" flex flex-col md:flex-row md:items-center md:justify-end gap-2 mb-4">
              <Button variant={"custom"}>
                <Link to="/overview">Access Admin Views</Link>
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* Metrics */}
        {/* Metrics */}
        <div className="flex flex-col items-center md:flex-row gap-4 md:pb-9 mb-4 w-full">
          {metrics.map((metric, idx) => {
            const isMissed = metric.title === "Total Payments Missed";

            return (
              <div
                key={idx + 1}
                className="border border-[#CCA33D80] dark:bg-[#252525] dark:border-[#EDEDED24] w-full h-[135px] rounded-lg p-3 flex flex-col justify-between"
              >
                <div className="flex items-center gap-x-3">
                  <div className={cn("flex justify-center items-center w-10 h-10 rounded-full", isMissed ? "bg-[#FEE4E2]" : "bg-[#D1FADF]")}>{metric.icon}</div>
                  <span className="text-sm font-medium">{metric.title}</span>
                </div>

                <div className="text-2xl font-bold self-start md:self-auto">{metric.value}</div>
              </div>
            );
          })}

          {hasSubscription ? (
            paystackSub ? (
              <UpdateOnlineMonthlyPaystackPayment filterData={filterData} recurringPaymentId={paystackSub} />
            ) : (
              <UpdateOnlineMonthlyStripePayment filterData={filterData} subscriptionId={latestSubscription} />
            )
          ) : (
            <MakeOnlineMonthlyPayment filterData={filterData} handleBankPopupClosed={handleBankPopupClosed} />
          )}
        </div>

        <div className="w-full flex justify-end">
          <div className="mb-2 flex items-center max-w-max gap-2 justify-end border py-2 font-bold px-4 rounded-xl bg-GGP-darkGold text-white dark:bg-GGP-lightGold dark:text-black">
            <span>Tracking Year: </span>
            <Select onValueChange={setTrackingYear} defaultValue={currentYear} value={trackingYear}>
              <SelectTrigger className="h-12 max-w-max">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="shad-select-content">
                {since2025YearsOptions.map((year: SelectOptions) => (
                  <SelectItem key={year.value} value={year.value as unknown as string}>
                    <div className="flex items-center cursor-pointer gap-3">
                      <p>{year.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Monthly Status */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pb-5 md:pb-2">
          {monthsOfTheYear.map((month, index) => {
            const isPaid = paidMonths.includes(month);
            const isPending = !isPaid && index === +currentMonthIndex && +trackingYear >= +currentYear;
            const isDefaulted = !isPaid && (+trackingYear < remissionStartYear || (index < +remissionStartMonth && +trackingYear === +remissionStartYear)); //  year or months exempted before start

            const isMissed =
              !isPaid &&
              +trackingYear >= +remissionStartYear &&
              ((+trackingYear === +currentYear && +trackingYear === +remissionStartYear && index >= +remissionStartMonth && index < +currentMonthIndex) ||
                (+trackingYear === +currentYear && +trackingYear > +remissionStartYear && index < +currentMonthIndex) ||
                (+trackingYear < +currentYear && +trackingYear === +remissionStartYear && index >= +remissionStartMonth));

            const ringClass = isPaid ? "bg-[#D1FADF]" : isMissed ? "bg-red-100" : "bg-gray-200 dark:bg-gray-700";

            const textClass = isPaid ? "text-[#039855]" : isMissed ? "text-red-500" : "text-gray-400";
            // const ringClass = isPaid ? "bg-[#D1FADF]" : isDefaulted ? "bg-[#FCA5A5]" : isMissed ? "bg-red-100" : "bg-gray-200 dark:bg-gray-700";

            // const textClass = isPaid ? "text-[#039855]" : isDefaulted ? "text-[#B91C1C]" : isMissed ? "text-red-500" : "text-gray-400";

            return (
              <div
                key={month}
                className="rounded-lg border border-[#EDEDED] dark:border-transparent dark:bg-[#252525] md:h-[170px] md:min-w-[220px] p-3 flex flex-col items-center justify-center text-center"
              >
                <div className="text-base font-medium">{month}</div>

                <div className="my-2">
                  {isPaid ? (
                    <div className={`flex justify-center items-center w-11 h-11 max-sm:w-9 max-sm:h-9 rounded-full ${ringClass}`}>
                      <CircleCheckBig size={24} className="text-[#039855]" strokeWidth={2} />
                    </div>
                  ) : isDefaulted ? (
                    <div className={`flex justify-center items-center w-11 h-11 max-sm:w-9 max-sm:h-9 rounded-full ${ringClass}`}>
                      <CircleDashed size={24} className="text-gray-400" strokeWidth={2} />
                    </div>
                  ) : isMissed || isPending ? (
                    <div className={`flex justify-center items-center w-11 h-11 max-sm:w-9 max-sm:h-9 rounded-full ${ringClass}`}>
                      <CircleAlert size={24} className="text-red-500" strokeWidth={2} />
                    </div>
                  ) : (
                    // FUTURE / NEUTRAL
                    <div className={`flex justify-center items-center w-11 h-11 max-sm:w-9 max-sm:h-9 rounded-full ${ringClass}`}>
                      <CircleAlert size={24} className="text-gray-400" strokeWidth={2} />
                    </div>
                  )}
                </div>
                <div className={`text-lg font-semibold ${textClass}`}>
                  {isPaid ? "Paid" : isDefaulted ? "Exempted" : isMissed ? "Missed" : isPending ? "Pending" : "Future"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ContainerFluid>
  );
}
