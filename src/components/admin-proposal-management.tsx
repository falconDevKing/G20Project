import dayjs from "dayjs";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

import { ContainerFluid } from "./containerFluid";
import { DynamicFilter } from "./dynamicFilters/DynamicFilters";
// import { SimpleTable } from "@/components/dashboard/SimpleTable";
import { G20ProposalDetailsDrawer } from "@/components/dashboard/g20ProposalDetailsDrawer";
import { useAppSelector } from "@/redux/hooks";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import { findChapterDetails, findDivisionDetails } from "@/services/payment";
import { getProposedDisplayStatus } from "@/services/g20Dashboard";
import type { ProposedPaymentScheduleRowType } from "@/supabase/modifiedSupabaseTypes";
import DataTable from "./paymentHistoryTable/table";

export const AdminProposalManagement = () => {
  const permission_type = useAppSelector((state) => state.auth.userDetails.permission_type || "");

  const [tableData, setTableData] = useState<ProposedPaymentScheduleRowType[]>([]);
  const [tableDataCount, setTableDataCount] = useState<number>(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [refreshData, setRefreshData] = useState(0);
  const [selectedProposal, setSelectedProposal] = useState<ProposedPaymentScheduleRowType | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  const columns = useMemo<ColumnDef<ProposedPaymentScheduleRowType>[]>(
    () => [
      {
        accessorKey: "proposed_date",
        header: "Proposed Date",
        cell: ({ row }) => <div>{dayjs(row.original.proposed_date).format("MMM DD, YYYY")}</div>,
      },
      {
        id: "user_name",
        header: "Honourable",
        cell: ({ row }) => <div>{`${row.original.first_name || ""} ${row.original.last_name || ""}`.trim()}</div>,
      },
      {
        accessorKey: "proposed_amount",
        header: "Amount",
        cell: ({ row }) => {
          const chapterCurrency = row.original.currency || findChapterDetails(row.original.chapter_id || "").currency || "NGN";
          return <div>{numberWithCurrencyFormatter(chapterCurrency, Number(row.original.proposed_amount || 0))}</div>;
        },
      },
      {
        accessorKey: "chapter_id",
        header: "Chapter",
        cell: ({ row }) => (
          <div className="capitalize flex flex-col align-middle">
            <span>{findChapterDetails(row.original.chapter_id || "").chapterName || "---"}</span>
            <span className="text-[10px]">({findDivisionDetails(row.original.division_id || "").divisionName || "---"})</span>
          </div>
        ),
      },
      {
        accessorKey: "schedule_year",
        header: "Scheduled Year",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = getProposedDisplayStatus({
            status: row.original.status,
            proposed_date: row.original.proposed_date,
          });
          const badgeClass =
            status === "cleared"
              ? "bg-green-100 text-green-700 border-green-200"
              : status === "missed"
                ? "bg-red-100 text-red-700 border-red-200"
                : status === "due"
                  ? "bg-amber-100 text-amber-700 border-amber-200"
                  : "bg-blue-100 text-blue-700 border-blue-200";

          return <Badge className={`capitalize ${badgeClass}`}>{status}</Badge>;
        },
      },
    ],
    [],
  );

  return (
    <section>
      <ContainerFluid>
        <div className="pt-2 text-2xl lg:text-3xl font-bold">Proposal Management</div>
        <div className="mb-4 text-md text-base dark:text-white text-GGP-dark/75">Track and clear partner proposal schedules.</div>

        <DynamicFilter
          filterType="Proposed"
          allow="Admin"
          permission_type={permission_type}
          updateTableData={(data) => setTableData(data as ProposedPaymentScheduleRowType[])}
          updateTableDataCount={(count) => setTableDataCount(count)}
          paymentType="ProposalManagement"
          tableName="proposed_payment_schedule"
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          refreshData={refreshData}
          expandable
          showSearch
        />

        <DataTable<ProposedPaymentScheduleRowType>
          count={tableDataCount}
          // customText="Remission Tracker for"
          columns={columns}
          data={tableData}
          tableType="remissionHistoy"
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          onRowClick={(proposal) => {
            setSelectedProposal(proposal);
            setOpenDetails(true);
          }}
          // order={paymentDetailsOrder}
        />

        {/* <SimpleTable<ProposedPaymentScheduleRowType>
          data={tableData}
          columns={columns}
          count={tableDataCount}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          onRowClick={(proposal) => {
            setSelectedProposal(proposal);
            setOpenDetails(true);
          }}
        /> */}
      </ContainerFluid>

      <G20ProposalDetailsDrawer
        open={openDetails}
        setOpen={setOpenDetails}
        proposal={selectedProposal}
        onProposalUpdated={async () => {
          setRefreshData((prev) => prev + 1);
        }}
      />
    </section>
  );
};
