import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ContainerFluid } from "./containerFluid";
import DataTable from "./paymentHistoryTable/table";
import { paymentDetailsOrder, userColumns } from "@/constants";
import { getPaidMonths, initialiseDataList, monthsOfTheYear } from "@/lib/utils";
import dayjs from "dayjs";
import { LogPayment } from "./paymentHistoryTable/logPayment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSmartDebounce } from "@/hooks/useSmartDebounce";
import SupabaseClient from "@/supabase/supabaseConnection";
import { PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
import { CircleAlert, CircleCheckBig, CircleDashed } from "lucide-react";
import { DynamicFilter } from "./dynamicFilters/DynamicFilters";
import { getUserPayments } from "@/redux/paymentSlice";
import { sendEmail } from "@/services/sendMail";
import { refreshLoggedInUser } from "@/services/auth";
import PaymentLogNotification from "@/mailTemplates/paymentLogNotificationNew";
import { DummyObject } from "@/interfaces/tools";
import { sendPaymentLogNotificationMessage } from "@/services/twilioMessaging";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import { CombinedOnlinePayment } from "./paymentHistoryTable/CombinedOnlinePayment";

const PAGE_SIZE = 10;

export const UserPaymentHistory = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.userDetails);
  const appState = useAppSelector((state) => state.app);
  const userPayments = useAppSelector((state) => state.payment.userPayments);
  const userRemissionStartDate = user.remission_start_date;
  const isIndividual = user.permission_type === "individual";
  // const permission_type = user.permission_type || "";
  const currentMonthIndex = +dayjs().format("M") - 1;
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

  const currentYear = dayjs().format("YYYY");
  const trackingYear = currentYear;
  const remissionStartMonth = userRemissionStartDate && dayjs(userRemissionStartDate).year() === dayjs().year() ? dayjs(userRemissionStartDate).month() : 0;
  const remissionStartYear = userRemissionStartDate && dayjs(userRemissionStartDate).year();

  const fetchFilteredData = async (page: number) => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = SupabaseClient.from("payment")
      .select("*", { count: "exact" }) // include total count for pagination
      .order("payment_date", { ascending: false })
      .range(from, to)
      .eq("user_id", user.id);

    const { data, count, error } = await query;

    if (error) throw error;

    updateTableData(data);
    updateTableDataCount(count || 1);
  };

  const paidMonths = useMemo(() => getPaidMonths(userPayments), [userPayments]);

  // ADD DEBOUNCE TO FILTER
  const debouncedFilter = useSmartDebounce(() => fetchFilteredData(page), 500);

  const filterData = useCallback(() => {
    // listen for changes to run filter
    // setPage(1);
    debouncedFilter();
  }, [page]);

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
    filterData();
  }, [filterData]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section className=" ">
      <ContainerFluid>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end">
          <div>
            <div className="pt-2 text-2xl lg:text-3xl text-GGP-dark dark:text-GGP-darkGold tracking-tight leading-tight font-semibold py-4">
              {isIndividual ? "" : "Your "}Remission History
            </div>
            <div className="text-md dark:text-white text-GGP-dark/50 max-w-[530px] ">Thank you for your commitment towards your partnership.</div>
            <div className="mb-6 text-md dark:text-white text-GGP-dark/50 max-w-[530px] ">Below are the records of your remissions.</div>
          </div>

          <div className=" flex flex-col md:flex-row md:items-center md:justify-end gap-2">
            <CombinedOnlinePayment filterData={filterData} forUser handleBankPopupClosed={handleBankPopupClosed} />
            <LogPayment filterData={filterData} forUser postLogPaymentProcessing={postLogPaymentProcessing} />
          </div>
        </div>

        <div className="hidden xl:flex flex-col gap-4 pb-6">
          {/* Grid for Months */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
            {monthsOfTheYear.map((month, index) => {
              const isPaid = paidMonths.includes(month);
              const isPending = !isPaid && index === +currentMonthIndex && +trackingYear >= +currentYear;
              const isDefaulted = !isPaid && (+trackingYear < remissionStartYear || (index < +remissionStartMonth && +trackingYear === +remissionStartYear)); //  year or months exempted before start

              const isMissed =
                !isPaid &&
                +trackingYear >= +remissionStartYear &&
                ((+trackingYear === +currentYear && +trackingYear === +remissionStartYear && index >= +remissionStartMonth && index < +currentMonthIndex) ||
                  (+trackingYear === +currentYear && +trackingYear > +remissionStartYear && index < +currentMonthIndex) ||
                  (+trackingYear < +currentYear && +trackingYear === +remissionStartYear && index >= +remissionStartMonth)); // months fully overdue before start

              return (
                <div
                  key={month}
                  className="flex items-center justify-between w-[190px] lg:w-[220px] 2xl:w-[190px] flex-wrap md:px-7 px-5 md:py-2 py-1 border border-[#E0C97F] dark:bg-[#252525] dark:border-[#EDEDED24] rounded-full"
                >
                  <span className="font-semibold max-sm:text-sm dark:text-white text-[#171721]">{month}</span>

                  {/* PAID */}
                  {isPaid ? (
                    <div className="flex justify-center items-center w-10 h-10 max-sm:w-9 max-sm:h-9  rounded-full bg-[#D1FADF]">
                      <CircleCheckBig size={18} className="text-[#039855]" strokeWidth={2} />
                    </div>
                  ) : /* DEFAULTED */
                  isDefaulted ? (
                    <div className="flex justify-center items-center w-10 h-10 max-sm:w-9 max-sm:h-9  rounded-full bg-gray-100">
                      <CircleDashed size={18} className="text-gray-400" strokeWidth={2} />
                    </div>
                  ) : /* MISSED (late but not fully defaulted) */
                  isMissed || isPending ? (
                    <div className="flex justify-center items-center w-10 h-10 max-sm:w-9 max-sm:h-9  rounded-full bg-red-100">
                      <CircleAlert size={18} className="text-red-500" strokeWidth={2} />
                    </div>
                  ) : (
                    /* FUTURE / NEUTRAL */
                    <div className="flex justify-center items-center w-10 h-10 max-sm:w-9 max-sm:h-9  rounded-full bg-gray-100">
                      <CircleAlert size={18} className="text-gray-400" strokeWidth={2} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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
      </ContainerFluid>
    </section>
  );
};
