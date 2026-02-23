import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { AlertCircle, CircleCheckBig } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import dayjs from "dayjs";
import { cn, getDashboardSummary, initialiseDataList } from "@/lib/utils";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import { findChapterDetails } from "@/services/payment";
import { MakeOnlineMonthlyPayment } from "../paymentHistoryTable/makeOnlineMonthlyPayment";
import { getUserPayments } from "@/redux/paymentSlice";
import { UpdateOnlineMonthlyStripePayment } from "../paymentHistoryTable/updateOnlineMonthlyStripePayment";
import { UpdateOnlineMonthlyPaystackPayment } from "../paymentHistoryTable/updateOnlineMonthlyPaystackPayment";
import { Button } from "../ui/button";
import { Link } from "react-router";
import DashboardHeader from "./dashboardHeader";
import DataTable from "../paymentHistoryTable/table";
import { paymentDetailsOrder, userColumns } from "@/constants";
import { LogPayment } from "../paymentHistoryTable/logPayment";
import { useEffect, useRef, useState } from "react";
import { DynamicFilter } from "../dynamicFilters/DynamicFilters";
import { CombinedOnlinePayment } from "../paymentHistoryTable/CombinedOnlinePayment";
import { refreshLoggedInUser } from "@/services/auth";
import { PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
// import { useSmartDebounce } from "@/hooks/useSmartDebounce";
// import SupabaseClient from "@/supabase/supabaseConnection";
import { DummyObject } from "@/interfaces/tools";
import PaymentLogNotification from "@/mailTemplates/paymentLogNotificationNew";
import { sendPaymentLogNotificationMessage } from "@/services/twilioMessaging";
import { sendEmail } from "@/services/sendMail";

// const PAGE_SIZE = 10;

export default function DashboardCom() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.userDetails);
  const userPayments = useAppSelector((state) => state.payment.userPayments);

  const userRemissionStartDate = user.remission_start_date;
  const remissionStartMonth = userRemissionStartDate && dayjs(userRemissionStartDate).year() === dayjs().year() ? dayjs(userRemissionStartDate).month() : 0;
  const summary = getDashboardSummary(userPayments, remissionStartMonth);
  const { currency } = findChapterDetails(user.chapter_id);
  const paystackSub = user?.paystack_monthly_payment_id;
  const hasSubscription = !![user?.subscription_ids].flat().filter(Boolean).length || !!paystackSub;
  // const hasSubscription = !!user?.paystack_monthly_payment_id;
  const latestSubscription = user?.subscription_ids?.[user?.subscription_ids?.length - 1];

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

  const appState = useAppSelector((state) => state.app);

  // const isIndividual = user.permission_type === "individual";
  // const permission_type = user.permission_type || "";

  const { modifiedChapters } = initialiseDataList(appState);

  const [tableData, setTableData] = useState<PaymentRowType[]>(userPayments);
  const [tableDataCount, setTableDataCount] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");

  const updateTableData = (data: Record<string, any>[]) => {
    setTableData(data as PaymentRowType[]);
  };
  const updateTableDataCount = (count: number) => {
    setTableDataCount(count);
  };

  // const fetchFilteredData = async (page: number) => {
  //   const from = (page - 1) * PAGE_SIZE;
  //   const to = from + PAGE_SIZE - 1;

  //   let query = SupabaseClient.from("payment")
  //     .select("*", { count: "exact" }) // include total count for pagination
  //     .order("payment_date", { ascending: false })
  //     .range(from, to)
  //     .eq("user_id", user.id);

  //   const { data, count, error } = await query;

  //   if (error) throw error;

  //   updateTableData(data);
  //   updateTableDataCount(count || 1);
  // };

  // // ADD DEBOUNCE TO FILTER
  // const debouncedFilter = useSmartDebounce(() => fetchFilteredData(page), 500);

  // const filterTableData = useCallback(() => {
  //   // listen for changes to run filter
  //   // setPage(1);
  //   debouncedFilter();
  // }, [page]);

  const postLogPaymentProcessing = async ({
    user_name,
    currency,
    amount,
    remission_period,
    payment_date,
    chapterName,
    payerDataUser_id,
    userId,
    chapterReps,
  }: {
    user_name: string;
    currency: string;
    amount: number;
    remission_period: string;
    payment_date: string;
    chapterName: string;
    payerDataUser_id: string;
    userId: string;
    chapterReps: DummyObject[];
  }) => {
    try {
      filterData();

      // send Mail to client
      const mailSubject = `Remission Approval Pending — Action Required`;
      const mailBody = PaymentLogNotification({
        first_name: user_name,
        currency,
        amount: +amount,
        remission_period,
        remissionDate: dayjs(payment_date).format("MMMM DD, YYYY"),
        baseUrl: import.meta.env.VITE_APP_BASE_URL || "",
        chapterName,
      });

      const paymentRepsMail = (chapterReps || []).map((rep: DummyObject) => rep?.email || "").filter(Boolean);
      await sendEmail({ to: paymentRepsMail, mailSubject, mailBody });

      const paymentRepsPhoneMessagePromise = (chapterReps || []).map(async (rep) => {
        const { phone_number, name } = rep;
        if (phone_number) {
          await sendPaymentLogNotificationMessage({
            to: phone_number,
            name,
            remission_period,
            remission_amount: numberWithCurrencyFormatter(currency, amount),
            payment_date: dayjs(payment_date).format("MMMM DD, YYYY"),
            chapter_name: chapterName,
          });
        }
      });

      await Promise.all(paymentRepsPhoneMessagePromise);

      dispatch(getUserPayments());

      if (userId === payerDataUser_id) {
        await refreshLoggedInUser(userId || "");
        filterData();
      }
    } catch (error: any) {
      console.log("postLogPaymentProcessing user", error?.message, error);
    }
  };

  useEffect(() => {
    filterData();
  }, [filterData]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <DashboardHeader />
      <div className="p-6 lg:px-24">
        <div className="flex flex-col md:flex-row md:justify-between gap-x-2">
          <div>
            <div className="pt-2 text-2xl lg:text-3xl font-bold dark:text-GGP-darkGold">Welcome, {user.first_name}.</div>
            <p className="max-w-[530px] mb-4 font-light text-base dark:text-white text-GGP-dark/75">
              Thank you for your commitment towards your partnership. Below is the summary of your remissions.
            </p>
          </div>

          {isAdmin ? (
            <div className=" flex flex-col md:flex-row md:items-center md:justify-end gap-2">
              <CombinedOnlinePayment filterData={filterData} forUser handleBankPopupClosed={handleBankPopupClosed} />
              <LogPayment filterData={filterData} forUser postLogPaymentProcessing={postLogPaymentProcessing} />

              <Button variant={"custom"} size={"lg"} className="w-full md:w-auto mb-6">
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

        <div>
          {/* DYNAMIC_FILTERS */}
          <DynamicFilter
            filterType={"Payment"}
            allow={"Individual"}
            // permission_type={permission_type}
            updateTableData={updateTableData}
            updateTableDataCount={updateTableDataCount}
            paymentType={"Remissions"}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
          />

          <DataTable
            count={tableDataCount}
            // customText="Remission Tracker for"
            columns={userColumns(modifiedChapters)}
            data={tableData}
            tableType="remissionHistoy"
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            order={paymentDetailsOrder}
          />
        </div>
      </div>
    </div>
  );
}
