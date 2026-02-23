import { useState, Suspense } from "react";
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import { Loader, ClipboardClock, CircleX, CalendarCog } from "lucide-react";
import { ApprovePayment } from "./approvePayment";
import { useAppSelector } from "@/redux/hooks";
import MobileTableCard from "../mobileTableCard";
import MobileTableHeader from "../mobileTableHeader";
import useLargeScreen from "@/hooks/checkScreenSize";
import { PartnerRowType, PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useLocation } from "react-router";
import { PartnerPaymentDetails } from "../PartnerDetails";
import { SelectOptions } from "@/interfaces/register";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pageSizeOptions } from "@/lib/utils";
import { sendPaymentReceivedMessage } from "@/services/twilioMessaging";
import dayjs from "dayjs";
import { sendEmail } from "@/services/sendMail";
import { updateUserStatus } from "@/services/payment";
import { refreshLoggedInUser } from "@/services/auth";
import PaymentReciept from "@/mailTemplates/paymentRecieptNew";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";

interface DataTableProps {
  data: PaymentRowType[];
  columns: ColumnDef<PaymentRowType>[];
  tableType: string;
  count: number;
  pageSize: string;
  setPageSize: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  customText?: string;
  order: string[];
  setRefreshData?: React.Dispatch<React.SetStateAction<number>>;
}

export default function DataTable({
  columns,
  data,
  tableType,
  count,
  page,
  setPage,
  pageSize = "10",
  setPageSize,
  customText,
  order,
  setRefreshData,
}: DataTableProps) {
  const permission_type = useAppSelector((state) => state.auth.userDetails.permission_type);
  const [details, setDetails] = useState<Partial<PaymentRowType> | Partial<PartnerRowType>>({});
  const [paymentData, setPaymentData] = useState<PaymentRowType>();
  const [openDialog, setOpenDialog] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  // To hide Remission Tracker text for other pages...
  const location = useLocation();
  const isProfilePage = location.pathname === "/";

  const isDivisionalRep = ["division", "organisation"].includes(permission_type);
  const selectRow = (row: any) => {
    if (tableType === "pendingRemissions" && isDivisionalRep) {
      setPaymentData(row.original);
      setOpenDialog(true);
    } else {
      setDetails(row.original);
      setOpenSheet(true);
    }
  };

  const totalPages = Math.ceil(count / +pageSize);
  const isLargeScreen = useLargeScreen();

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const postApprovePaymentProcessing = async ({
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
      setRefreshData && setRefreshData((prev) => prev + 1);

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
      console.log("postApprovePaymentProcessing", error?.message, error);
    }
  };

  return (
    <Suspense
      fallback={
        <div className="text-center py-4 animate-spin text-GGP-darkGold flex justify-center items-center">
          <Loader />
        </div>
      }
    >
      <div className="w-full md:border border-[#ae9956] dark:bg-[#252525]/35 dark:border-[#EDEDED24] rounded-xl shadow-sm overflow-hidden">
        {customText && (
          <h2 className="font-normal text-lg text-left px-6 py-4">
            {customText} {isProfilePage && new Date().getFullYear()}
          </h2>
        )}
        <Table>
          {/* Table Header */}
          <TableHeader className="hidden md:contents">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-[#FFF8E5] dark:bg-[#CCA33D]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[#171721] dark:text-white font-semibold px-7 text-sm md:text-base">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Mobile header fallback */}
          <MobileTableHeader tableType={tableType} />

          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) =>
                isLargeScreen ? (
                  <TableRow
                    key={row.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectRow(row);
                    }}
                    className={`hover:bg-muted/50 transition-colors ${isDivisionalRep ? "cursor-pointer" : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === "approved_by") {
                        const { status, approved_by } = row.original;
                        const interim_approved_by_image = "";
                        const isPaid = status === "Paid";
                        const approvedName = ["Setup", "Paid"].includes(status || "") ? approved_by || "" : status || "";
                        const initials = approvedName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase();

                        const FallBackIcon =
                          status === "Setup" ? (
                            <CalendarCog className={"w-8 h-8"} />
                          ) : status === "Pending" ? (
                            <ClipboardClock className={"w-8 h-8"} />
                          ) : (
                            <CircleX className={"w-8 h-8"} />
                          );

                        return (
                          <TableCell key={cell.id} className="px-7 py-4">
                            <div className="flex items-center gap-3">
                              {status === "Paid" && (
                                <Avatar className="w-10 h-10">
                                  {interim_approved_by_image ? (
                                    <AvatarImage src={interim_approved_by_image ?? ""} alt={approvedName} />
                                  ) : (
                                    <AvatarFallback>{initials}</AvatarFallback>
                                  )}
                                </Avatar>
                              )}
                              <div className="flex flex-col w-full ">
                                <div className={`text-sm font-semibold`}>
                                  {isPaid ? (
                                    approvedName
                                  ) : (
                                    <span className="flex items-center gap-3 px-1">
                                      {FallBackIcon} {approvedName}
                                    </span>
                                  )}
                                </div>
                                {/* Uncomment if email is available:
                              <span className="text-xs text-gray-500">
                                {row.original.approved_by ?? "no-email"}
                              </span> */}
                              </div>
                            </div>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={cell.id} className="px-7 py-4 text-xs md:text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ) : (
                  <MobileTableCard
                    key={row.id}
                    row={row}
                    tableType={tableType}
                    clickHandler={() => {
                      selectRow(row);
                    }}
                  />
                ),
              )
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {(totalPages > 1 || +pageSize > 10) && (
          <div>
            <hr className="my-2 border-t dark:border-[#252525]" />
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2 ">
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>

                <div>
                  <Select onValueChange={setPageSize} defaultValue={pageSize} value={pageSize}>
                    <SelectTrigger className="shad-select-trigger">
                      <SelectValue placeholder="Select your Gender" />
                    </SelectTrigger>
                    <SelectContent className="shad-select-content">
                      {pageSizeOptions.map((pageOptions: SelectOptions) => (
                        <SelectItem key={pageOptions.value} value={pageOptions.value as string}>
                          <div className="flex items-center cursor-pointer gap-3">
                            <p>{pageOptions.name}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="lg2" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                  Previous
                </Button>
                <Button variant="outline" size="lg2" onClick={() => setPage((prev) => (prev + 1 > totalPages ? prev : prev + 1))} disabled={page >= totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approve Dialog */}
      <ApprovePayment
        paymentData={paymentData}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        setRefreshData={setRefreshData}
        postApprovePaymentProcessing={postApprovePaymentProcessing}
      />
      {/* PartnerPaymentDetails Drawer */}
      <PartnerPaymentDetails details={details} open={openSheet} setOpen={setOpenSheet} order={order} />
    </Suspense>
  );
}
