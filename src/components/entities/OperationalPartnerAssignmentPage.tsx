import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useAppSelector } from "@/redux/hooks";
import { initialiseAdminOptions } from "@/lib/utils";
import { DynamicFilter } from "@/components/dynamicFilters/DynamicFilters";
import { FilterType } from "@/components/dynamicFilters/filterOptions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimpleTable } from "@/components/dashboard/SimpleTable";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { assignPartnersToOperationalHierarchy, fetchFilteredPartnerIds } from "@/services/tools";
import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";
import { findChapterDetails, findDivisionDetails } from "@/services/payment";

export const OperationalPartnerAssignmentPage = () => {
  const appState = useAppSelector((state) => state.app);
  const { ShepherdOptions, GovernorOptions, PresidentOptions } = initialiseAdminOptions(appState);

  const [tableData, setTableData] = useState<PartnerRowType[]>([]);
  const [tableDataCount, setTableDataCount] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("20");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterData, setFilterData] = useState<Record<string, any>[]>([]);
  const [refreshData, setRefreshData] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [shepherdId, setShepherdId] = useState("");
  const [governorId, setGovernorId] = useState("");
  const [presidentId, setPresidentId] = useState("");

  const scopedGovernorOptions = useMemo(
    () => GovernorOptions.filter((governor) => (shepherdId ? governor.shepherd_id === shepherdId : true)),
    [GovernorOptions, shepherdId],
  );
  const scopedPresidentOptions = useMemo(
    () =>
      PresidentOptions.filter((president) => (shepherdId ? president.shepherd_id === shepherdId : true)).filter((president) =>
        governorId ? president.governor_id === governorId : true,
      ),
    [PresidentOptions, shepherdId, governorId],
  );
  const lockedFilters = useMemo<FilterType[]>(() => [{ field: "president_id", operator: "Equals", value: null }], []);
  const toggleId = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id]));
  };

  const columns = useMemo<ColumnDef<PartnerRowType>[]>(
    () => [
      {
        id: "pick",
        header: "Pick",
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.includes(row.original.id)}
            // onCheckedChange={() => toggleId(row.original.id)}
            className="dark:border-G20-darkGold"
          />
        ),
      },
      {
        id: "name",
        header: "Name",
        cell: ({ row }) => `${row.original.first_name || ""} ${row.original.last_name || ""}`.trim() || "---",
      },
      {
        accessorKey: "unique_code",
        header: "Code",
        cell: ({ row }) => row.original.unique_code || "---",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div className="truncate max-w-[240px]">{row.original.email || "---"}</div>,
      },
      {
        accessorKey: "division_id",
        header: "Division",
        cell: ({ row }) => <div>{findDivisionDetails(row.original.division_id || "").divisionName || "---"}</div>,
      },
      {
        accessorKey: "chapter_id",
        header: "Chapter",
        cell: ({ row }) => <div>{findChapterDetails(row.original.chapter_id || "").chapterName || "---"}</div>,
      },
      // {
      //   id: "shepherd",
      //   header: "Current Shepherd",
      //   cell: ({ row }) => ShepherdOptions.find((shepherd) => shepherd.value === row.original.shepherd_id)?.name || "---",
      // },
      // {
      //   id: "governor",
      //   header: "Current Governor",
      //   cell: ({ row }) => GovernorOptions.find((governor) => governor.value === row.original.governor_id)?.name || "---",
      // },
      // {
      //   id: "president",
      //   header: "Current President",
      //   cell: ({ row }) => PresidentOptions.find((president) => president.value === row.original.president_id)?.name || "---",
      // },
    ],
    [
      //PresidentOptions, GovernorOptions, ShepherdOptions,
      selectedIds,
    ],
  );

  const assignByIds = async (partnerIds: string[]) => {
    try {
      if (!presidentId) {
        ErrorHandler("Please select a President before assigning partners.");
        return;
      }
      if (!partnerIds.length) {
        ErrorHandler("No partners selected.");
        return;
      }

      setIsPending(true);
      await assignPartnersToOperationalHierarchy({
        partnerIds,
        shepherd_id: shepherdId,
        governor_id: governorId || undefined,
        president_id: presidentId || undefined,
      });

      SuccessHandler("Partners assigned successfully.");
      setSelectedIds([]);
      setRefreshData((prev) => prev + 1);
    } catch (error: any) {
      console.log("assignByIds error", error);
      ErrorHandler(error?.message || "Unable to assign partners.");
    } finally {
      setIsPending(false);
    }
  };

  const assignSelected = async () => {
    await assignByIds(selectedIds);
  };

  const assignAllFiltered = async () => {
    try {
      setIsPending(true);
      const partnerIds = await fetchFilteredPartnerIds([...(lockedFilters as any[]), ...(filterData as any[])]);
      if (!partnerIds.length) {
        ErrorHandler("No partners found for current filters.");
        return;
      }

      await assignByIds(partnerIds);
    } catch (error: any) {
      console.log("assignAllFiltered error", error);
      ErrorHandler(error?.message || "Unable to assign filtered partners.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="md:text-2xl text-lg font-bold dark:text-white text-GGP-dark">Assign Partners To Houses</h1>
        <p className="max-w-[760px] font-light text-base dark:text-white text-GGP-dark/75">
          Select a President, then assign selected partners or all currently filtered partners that do not already have a president.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Select
          value={shepherdId}
          onValueChange={(value) => {
            setShepherdId(value);
            setGovernorId("");
            setPresidentId("");
          }}
        >
          <SelectTrigger className="shad-select-trigger">
            <SelectValue placeholder="Select Shepherd" />
          </SelectTrigger>
          <SelectContent className="shad-select-content">
            {ShepherdOptions.map((shepherd) => (
              <SelectItem key={shepherd.value} value={shepherd.value}>
                {shepherd.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={governorId}
          onValueChange={(value) => {
            setGovernorId(value);
            if (!shepherdId) {
              const selectedGovernor = scopedGovernorOptions.find((gov) => gov.value === value);
              setShepherdId(selectedGovernor?.shepherd_id || "");
            }
            setPresidentId("");
          }}
        >
          <SelectTrigger className="shad-select-trigger">
            <SelectValue placeholder="Select Governor" />
          </SelectTrigger>
          <SelectContent className="shad-select-content">
            {scopedGovernorOptions.map((governor) => (
              <SelectItem key={governor.value} value={governor.value}>
                {governor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={presidentId}
          onValueChange={(value) => {
            const selectedPresident =
              scopedPresidentOptions.find((president) => president.value === value) || PresidentOptions.find((president) => president.value === value);
            setShepherdId(selectedPresident?.shepherd_id || "");
            setGovernorId(selectedPresident?.governor_id || "");
            setPresidentId(value);
          }}
        >
          <SelectTrigger className="shad-select-trigger">
            <SelectValue placeholder="Select President" />
          </SelectTrigger>
          <SelectContent className="shad-select-content">
            {scopedPresidentOptions.map((president) => (
              <SelectItem key={president.value} value={president.value}>
                {president.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={assignAllFiltered} disabled={isPending} className="border-G20-darkGold">
          {isPending ? "Assigning..." : "Assign All Filtered"}
        </Button>
        <Button variant="custom" onClick={assignSelected} disabled={isPending || !selectedIds.length}>
          {isPending ? "Assigning..." : `Assign Selected (${selectedIds.length})`}
        </Button>
      </div>

      <DynamicFilter
        filterType="Partner"
        allow="Admin"
        paymentType="PartnerAssignment"
        tableName="partner"
        updateTableData={(data) => setTableData(data as PartnerRowType[])}
        updateTableDataCount={setTableDataCount}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        getFilterData={setFilterData}
        refreshData={refreshData}
        showSearch
        expandable
        lockedFilters={lockedFilters}
      />

      <SimpleTable
        tableType="assignment"
        columns={columns}
        data={tableData}
        count={tableDataCount}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onRowClick={(partner) => {
          toggleId(partner.id);
        }}
      />
    </div>
  );
};
