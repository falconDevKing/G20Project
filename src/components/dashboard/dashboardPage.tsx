import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { CreditCard, DatabaseBackup, Shield, Sparkles } from "lucide-react";
import dayjs from "dayjs";

import { useAppSelector } from "@/redux/hooks";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DynamicFilter } from "@/components/dynamicFilters/DynamicFilters";
import { CombinedOnlinePayment } from "@/components/paymentHistoryTable/CombinedOnlinePayment";

import { G20DashboardHeader } from "./g20DashboardHeader";
import { SimpleTable } from "./SimpleTable";
import { UpdateProposedScheduleDrawer } from "./updateProposedScheduleDrawer";
import { G20LogOfflinePayment } from "./g20LogOfflinePayment";
import { G20PaymentDetailsDrawer } from "./g20PaymentDetailsDrawer";
import {
  fetchG20AutomationState,
  fetchG20PaymentStats,
  fetchProposedScheduleRowsByYear,
  getProposedDisplayStatus,
  isG20Automated,
} from "@/services/g20Dashboard";
import { getNextOct30Window } from "@/services/proposedSchedule";
import type { G20PaymentRowType, PartnerRowType } from "@/supabase/modifiedSupabaseTypes";
import { CapitaliseText } from "@/lib/textUtils";
import { findChapterDetails } from "@/services/payment";

const ApprovedByCell = ({ approvedBy, status }: { approvedBy: string; status: string }) => {
  const label = approvedBy || status || "-";
  const initials = label
    .split(" ")
    .map((part) => part?.[0] || "")
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="dark:text-white">{initials || "NA"}</AvatarFallback>
      </Avatar>
      <span>{label}</span>
    </div>
  );
};

export default function DashboardCom() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.userDetails) as PartnerRowType;

  const [activeTab, setActiveTab] = useState("actual-payments");
  const [updateScheduleOpen, setUpdateScheduleOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [stats, setStats] = useState({ total_count: 0, total_value: 0 });
  const [automated, setAutomated] = useState(isG20Automated(user));

  const [actualData, setActualData] = useState<Record<string, any>[]>([]);
  const [actualCount, setActualCount] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [actualPageSize, setActualPageSize] = useState("10");

  const [proposedData, setProposedData] = useState<Record<string, any>[]>([]);
  const [proposedCount, setProposedCount] = useState(1);
  const [proposedPage, setProposedPage] = useState(1);
  const [proposedPageSize, setProposedPageSize] = useState("10");

  const [selectedPayment, setSelectedPayment] = useState<G20PaymentRowType | null>(null);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);

  const permissionType = user.permission_type || "individual";
  const opsPermissionType = user.ops_permission_type || "";
  const chapterId = user.chapter_id || "";
  const chapterCurrency = findChapterDetails(chapterId)?.currency || "NGN";
  const isAdmin = ["division", "organisation"].includes(permissionType) || ["shepherd", "governor", "president"].includes(opsPermissionType);

  const { scheduleYear } = useMemo(() => getNextOct30Window(), []);

  const reloadHeaderStats = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    const [paymentStats, automationState] = await Promise.all([fetchG20PaymentStats(user.id), fetchG20AutomationState(user.id)]);

    setStats(paymentStats);
    setAutomated(automationState.automated);
  }, [user?.id]);

  const refreshProposedTableAfterSave = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    const yearRows = await fetchProposedScheduleRowsByYear(user.id, scheduleYear);
    setProposedCount(yearRows.length);

    setRefreshKey((prev) => prev + 1);
    await reloadHeaderStats();
  }, [reloadHeaderStats, scheduleYear, user?.id]);

  useEffect(() => {
    reloadHeaderStats();
  }, [reloadHeaderStats, refreshKey]);

  const actualPaymentColumns = useMemo<ColumnDef<Record<string, any>>[]>(
    () => [
      {
        accessorKey: "payment_date",
        header: "Payment Date",
        cell: ({ row }) => dayjs(row.original.payment_date).format("MMM DD, YYYY"),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => numberWithCurrencyFormatter(row.original.currency || "NGN", Number(row.original.amount || 0)),
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "payment_channel",
        header: "Channel",
        cell: ({ row }) => CapitaliseText(row.original.payment_channel || "") || "-",
      },
      {
        accessorKey: "approved_by",
        header: "Approved By",
        cell: ({ row }) => <ApprovedByCell approvedBy={row.original.approved_by || ""} status={row.original.status || ""} />,
      },
    ],
    [],
  );

  const proposedScheduleColumns = useMemo<ColumnDef<Record<string, any>>[]>(
    () => [
      {
        accessorKey: "schedule_year",
        header: "Scheduled Year",
      },
      {
        accessorKey: "proposed_date",
        header: "Proposed Date",
        cell: ({ row }) => dayjs(row.original.proposed_date).format("MMM DD, YYYY"),
      },
      {
        accessorKey: "proposed_amount",
        header: "Proposed Amount",
        cell: ({ row }) => numberWithCurrencyFormatter("NGN", Number(row.original.proposed_amount || 0)),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = getProposedDisplayStatus(
            row.original as {
              status: "pending" | "missed" | "cleared";
              proposed_date: string;
            },
          );
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
      {
        accessorKey: "schedule_index",
        header: "Line",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#F8F4EA] dark:bg-G20-surface">
      <G20DashboardHeader />

      <div className="px-4 md:px-12 lg:px-24 py-6 space-y-6">
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1E1E1E] dark:text-white">Welcome, Honourable {user.first_name || "Partner"}</h1>
            <p className="text-[#475467] dark:text-gray-300 mt-1 max-w-2xl">Keep track of your commitments, payments, and proposed schedule in one place.</p>
          </div>

          <div className="flex flex-wrap justify-start xl:justify-end gap-2">
            <CombinedOnlinePayment filterData={() => setRefreshKey((prev) => prev + 1)} forUser />
            <G20LogOfflinePayment onSaved={async () => setRefreshKey((prev) => prev + 1)} />
            {isAdmin ? (
              <Button variant="custom" size="lg" disabled={!isAdmin}>
                <Link to="/overview">Access Admin Views</Link>
              </Button>
            ) : (
              ""
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white dark:bg-[#1A1B20] border border-[#D4AF37]/25 dark:border-white/10 p-4">
            <p className="text-sm text-[#667085] dark:text-gray-300">Total Paid Payments</p>
            <p className="text-2xl font-bold text-[#1E1E1E] dark:text-white">{stats.total_count}</p>
          </div>

          <div className="rounded-xl bg-white dark:bg-[#1A1B20] border border-[#D4AF37]/25 dark:border-white/10 p-4">
            <p className="text-sm text-[#667085] dark:text-gray-300">Total Paid Value</p>
            <p className="text-2xl font-bold text-[#1E1E1E] dark:text-white">{numberWithCurrencyFormatter(chapterCurrency, stats.total_value)}</p>
          </div>

          <div className="rounded-xl bg-white dark:bg-[#1A1B20] border border-[#D4AF37]/25 dark:border-white/10 p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2 text-[#1E1E1E] dark:text-white font-medium">
              <DatabaseBackup size={18} />
              Update Proposed Schedule
            </div>
            <Button variant="outline" onClick={() => setUpdateScheduleOpen(true)}>
              Open Drawer
            </Button>
          </div>

          <div className="rounded-xl bg-white dark:bg-[#1A1B20] border border-[#D4AF37]/25 dark:border-white/10 p-4 flex flex-col justify-between gap-3">
            <div className="flex items-center gap-2 text-[#1E1E1E] dark:text-white font-medium">
              {automated ? <Shield size={18} /> : <Sparkles size={18} />}
              {automated ? "Manage Automated Payments" : "Automate Payments"}
            </div>
            <Button variant="outline" onClick={() => navigate("/guides")}>
              {automated ? "Manage" : "Set Up"}
            </Button>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full md:w-[420px]">
            <TabsTrigger value="actual-payments" className="flex items-center gap-1">
              <CreditCard size={16} /> Actual Payments
            </TabsTrigger>
            <TabsTrigger value="proposed-schedule" className="flex items-center gap-1">
              <DatabaseBackup size={16} /> Proposed Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actual-payments" className="space-y-4 mt-4">
            <DynamicFilter
              name="Filter Payments"
              filterType="Payment"
              allow="Individual"
              paymentType="Payments"
              tableName="g20_payments"
              updateTableData={setActualData}
              updateTableDataCount={setActualCount}
              page={actualPage}
              pageSize={actualPageSize}
              setPage={setActualPage}
              showPills
              refreshData={refreshKey}
            />

            <SimpleTable
              columns={actualPaymentColumns}
              data={actualData}
              count={actualCount}
              page={actualPage}
              setPage={setActualPage}
              pageSize={actualPageSize}
              setPageSize={setActualPageSize}
              onRowClick={(row) => {
                setSelectedPayment(row as G20PaymentRowType);
                setPaymentDrawerOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="proposed-schedule" className="space-y-4 mt-4">
            <DynamicFilter
              name="Filter Proposed"
              filterType="Proposed"
              allow="Individual"
              paymentType="ProposedSchedule"
              tableName="proposed_payment_schedule"
              updateTableData={setProposedData}
              updateTableDataCount={setProposedCount}
              page={proposedPage}
              pageSize={proposedPageSize}
              setPage={setProposedPage}
              showPills
              refreshData={refreshKey}
            />

            <SimpleTable
              columns={proposedScheduleColumns}
              data={proposedData}
              count={proposedCount}
              page={proposedPage}
              setPage={setProposedPage}
              pageSize={proposedPageSize}
              setPageSize={setProposedPageSize}
            />
          </TabsContent>
        </Tabs>
      </div>

      <UpdateProposedScheduleDrawer open={updateScheduleOpen} setOpen={setUpdateScheduleOpen} user={user} onSaved={refreshProposedTableAfterSave} />
      <G20PaymentDetailsDrawer
        open={paymentDrawerOpen}
        setOpen={setPaymentDrawerOpen}
        payment={selectedPayment}
        onPaymentUpdated={async () => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}
