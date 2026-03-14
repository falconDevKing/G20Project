import dayjs from "dayjs";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarCog, CircleX, ClipboardClock } from "lucide-react";

// import { SimpleTable } from "@/components/dashboard/SimpleTable";
import { ContainerFluid } from "./containerFluid";
import { DynamicFilter } from "./dynamicFilters/DynamicFilters";
import { G20ApprovePaymentDialog } from "@/components/g20Admin/g20AdminPaymentDialogs";
import { useAppSelector } from "@/redux/hooks";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import { findChapterDetails } from "@/services/payment";
import type { G20PaymentRowType } from "@/supabase/modifiedSupabaseTypes";
import DataTable from "./paymentHistoryTable/table";

export const AdminRemissionLog = () => {
  const permission_type = useAppSelector((state) => state.auth.userDetails.permission_type || "");
  const isDivisionalRep = ["division", "organisation"].includes(permission_type);

  const [tableData, setTableData] = useState<G20PaymentRowType[]>([]);
  const [tableDataCount, setTableDataCount] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [refreshData, setRefreshData] = useState(1);
  const [openApprove, setOpenApprove] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<G20PaymentRowType | null>(null);

  const columns = useMemo<ColumnDef<G20PaymentRowType>[]>(
    () => [
      {
        accessorKey: "payment_date",
        header: "Payment Date",
        cell: ({ row }) => <div>{dayjs(row.original.payment_date).format("MMM DD, YYYY")}</div>,
      },
      {
        id: "user_name",
        header: "Honourable",
        cell: ({ row }) => <div>{`${row.original.first_name || ""} ${row.original.last_name || ""}`.trim()}</div>,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => <div>{numberWithCurrencyFormatter(row.original.currency || "NGN", Number(row.original.amount || 0))}</div>,
      },
      {
        accessorKey: "chapter_id",
        header: "Chapter",
        cell: ({ row }) => <div>{findChapterDetails(row.original.chapter_id || "").chapterName || "---"}</div>,
      },
      {
        accessorKey: "payment_channel",
        header: "Channel",
        cell: ({ row }) => <div className="capitalize">{row.original.payment_channel || "---"}</div>,
      },
      {
        accessorKey: "status",
        header: "Approval Status",
        cell: ({ row }) => {
          const status = String(row.original.status || "");
          const isPaid = ["Paid", "Setup"].includes(status);
          const approvedName = isPaid ? row.original.approved_by || status : status;
          const initials = approvedName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();

          const icon =
            status === "Setup" ? (
              <CalendarCog className="w-4 h-4" />
            ) : status === "Pending" ? (
              <ClipboardClock className="w-4 h-4" />
            ) : (
              <CircleX className="w-4 h-4" />
            );

          return (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{isPaid ? initials || "P" : icon}</AvatarFallback>
              </Avatar>
              <span>{approvedName || "---"}</span>
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <section>
      <ContainerFluid>
        <div className="pt-2 text-2xl lg:text-3xl font-bold">Pending Remission Log</div>
        <div className="mb-4 text-md text-base dark:text-white text-GGP-dark/75">Streamlined view to review and approve offline remissions seamlessly.</div>

        <DynamicFilter
          filterType="Payment"
          allow="Admin"
          permission_type={permission_type}
          updateTableData={(data) => setTableData(data as G20PaymentRowType[])}
          updateTableDataCount={(count) => setTableDataCount(count)}
          paymentType="pendingRemissions"
          tableName="g20_payments"
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          refreshData={refreshData}
          showSearch
          expandable
        />

        <DataTable<G20PaymentRowType>
          count={tableDataCount}
          // customText="Remission Tracker for"
          columns={columns}
          data={tableData}
          tableType="remissionHistoy"
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          onRowClick={(payment) => {
            setSelectedPayment(payment);
            isDivisionalRep && setOpenApprove(true);
          }}
          // order={paymentDetailsOrder}
        />

        {/* <SimpleTable<G20PaymentRowType>
          data={tableData}
          columns={columns}
          count={tableDataCount}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          onRowClick={(payment) => {
            if (!isDivisionalRep) return;
            setSelectedPayment(payment);
            setOpenApprove(true);
          }}
        /> */}
      </ContainerFluid>

      <G20ApprovePaymentDialog
        open={openApprove}
        setOpen={setOpenApprove}
        payment={selectedPayment}
        onSaved={async () => {
          setRefreshData((prev) => prev + 1);
        }}
      />
    </section>
  );
};
