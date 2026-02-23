import { adminColumns, paymentDetailsOrder } from "@/constants";
import { ContainerFluid } from "./containerFluid";
import DataTable from "./paymentHistoryTable/table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { initialiseDataList } from "@/lib/utils";
import { AddPayment } from "./paymentHistoryTable/addPayment";
import { useCallback, useState } from "react";
import { PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
import { LogPayment } from "./paymentHistoryTable/logPayment";
import { DynamicFilter } from "./dynamicFilters/DynamicFilters";
import PaymentReciept from "@/mailTemplates/paymentRecieptNew";
import dayjs from "dayjs";

import { sendEmail } from "@/services/sendMail";
import { refreshLoggedInUser } from "@/services/auth";
import { sendPaymentLogNotificationMessage, sendPaymentReceivedMessage } from "@/services/twilioMessaging";
import { updateUserStatus } from "@/services/payment";
import PaymentLogNotification from "@/mailTemplates/paymentLogNotificationNew";
import { DummyObject } from "@/interfaces/tools";
import { getUserPayments } from "@/redux/paymentSlice";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";

export const AdminPaymentHistory = () => {
  const dispatch = useAppDispatch();
  const appState = useAppSelector((state) => state.app);
  const permission_type = useAppSelector((state) => state.auth.userDetails.permission_type);

  const { modifiedChapters } = initialiseDataList(appState);
  const [tableData, setTableData] = useState<PaymentRowType[]>([]);
  const [tableDataCount, setTableDataCount] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [refreshData, setRefreshData] = useState(0);

  const updateTableData = (data: Record<string, any>[]) => {
    setTableData(data as PaymentRowType[]);
  };
  const updateTableDataCount = useCallback((count: number) => {
    setTableDataCount(count);
  }, []);

  const isDivisionalRep = ["division", "organisation"].includes(permission_type);

  const setNewPage = () => setPage(1);

  const postAddPaymentProcessing = async ({
    user_name,
    currency,
    amount,
    remission_period,
    payment_date,
    chapterName,
    approved_by,
    payerDataUser_id,
    payerDataRemission_start_date,
    userId,
    payerDataEmail,
    payerDataPhone_number,
  }: {
    user_name: string;
    currency: string;
    amount: number;
    remission_period: string;
    payment_date: string;
    chapterName: string;
    approved_by: string;
    payerDataUser_id: string;
    payerDataRemission_start_date: string;
    userId: string;
    payerDataEmail: string;
    payerDataPhone_number: string;
  }) => {
    try {
      setRefreshData((prev) => prev + 1);

      // send Mail to client
      const mailSubject = `Your GGP Remission Has Been Received!`;
      const mailBody = PaymentReciept({
        first_name: user_name,
        currency,
        amount: +amount,
        remission_period,
        remissionDate: dayjs(payment_date).format("MMMM DD, YYYY"),
        baseUrl: import.meta.env.VITE_APP_BASE_URL || "",
        chapterName,
        approved_by,
      });

      await sendEmail({ to: [payerDataEmail], mailSubject, mailBody });

      await sendPaymentReceivedMessage({
        to: payerDataPhone_number,
        name: user_name,
        amount: numberWithCurrencyFormatter(currency, amount),
        period: remission_period,
        remission_period: remission_period,
        remission_amount: numberWithCurrencyFormatter(currency, amount),
        payment_date: dayjs(payment_date).format("MMMM DD, YYYY"),
        chapter_name: chapterName,
        approved_by_name: approved_by,
      });

      await updateUserStatus(payerDataUser_id, payerDataRemission_start_date);

      if (userId === payerDataUser_id) {
        await refreshLoggedInUser(userId || "");
      }
    } catch (error: any) {
      console.log("postAddPaymentProcessing", error?.message, error);
    }
  };

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
      setRefreshData((prev) => prev + 1);

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

      if (userId === payerDataUser_id) {
        await refreshLoggedInUser(userId || "");
        dispatch(getUserPayments());
      }
    } catch (error: any) {
      console.log("postLogPaymentProcessing", error?.message, error);
    }
  };

  return (
    <section className=" ">
      <ContainerFluid>
        <div className="flex justify-between items-center">
          <div>
            <div className="pt-2 text-2xl lg:text-3xl font-bold"> Remission Management</div>
            <div className="mb-4 text-md text-base dark:text-white text-GGP-dark/75 "> View, manage, and track remissions seamlessly.</div>
          </div>
          <div className="mt-6">
            {isDivisionalRep ? (
              <AddPayment postAddPaymentProcessing={postAddPaymentProcessing} />
            ) : (
              <LogPayment filterData={setNewPage} postLogPaymentProcessing={postLogPaymentProcessing} />
            )}
          </div>
        </div>
        <DynamicFilter
          filterType={"Payment"}
          allow={"Admin"}
          permission_type={permission_type}
          updateTableData={updateTableData}
          updateTableDataCount={updateTableDataCount}
          paymentType={"Remissions"}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          refreshData={refreshData}
          showSearch
          expandable
        />

        <DataTable
          count={tableDataCount}
          columns={adminColumns(modifiedChapters)}
          data={tableData}
          tableType="remissionsManagement"
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
