import { useEffect, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { DynamicFilter } from "@/components/dynamicFilters/DynamicFilters";
import { FilterType } from "@/components/dynamicFilters/filterOptions";
import SupabaseClient from "@/supabase/supabaseConnection";
import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";

type PartnerSearchSelectProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  shepherdId?: string;
  governorId?: string;
  presidentId?: string;
};

export const PartnerSearchSelect = ({ value, onChange, placeholder = "Search partner", shepherdId, governorId, presidentId }: PartnerSearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<PartnerRowType[]>([]);
  const [tableDataCount, setTableDataCount] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize] = useState("10");
  const [selectedPartner, setSelectedPartner] = useState<PartnerRowType | null>(null);
  const [refreshData, setRefreshData] = useState(0);

  const lockedFilters = useMemo<FilterType[]>(
    () =>
      [
        shepherdId ? { field: "shepherd_id", operator: "Equals", value: shepherdId } : null,
        governorId ? { field: "governor_id", operator: "Equals", value: governorId } : null,
        presidentId ? { field: "president_id", operator: "Equals", value: presidentId } : null,
      ].filter(Boolean) as FilterType[],
    [shepherdId, governorId, presidentId],
  );

  const options = useMemo(
    () =>
      (users || []).map((user) => ({
        value: user.id,
        label: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || user.unique_code || "Unknown",
        code: user.unique_code || "",
      })),
    [users],
  );

  const selected = useMemo(
    () =>
      options.find((option) => option.value === value) ||
      (selectedPartner
        ? {
            value: selectedPartner.id,
            label:
              `${selectedPartner.first_name || ""} ${selectedPartner.last_name || ""}`.trim() ||
              selectedPartner.email ||
              selectedPartner.unique_code ||
              "Unknown",
            code: selectedPartner.unique_code || "",
          }
        : undefined),
    [options, selectedPartner, value],
  );

  useEffect(() => {
    setPage(1);
    setRefreshData((prev) => prev + 1);
  }, [shepherdId, governorId, presidentId]);

  useEffect(() => {
    if (!value) {
      setSelectedPartner(null);
      return;
    }

    const inResults = users.find((user) => user.id === value);
    if (inResults) {
      setSelectedPartner(inResults);
      return;
    }

    const loadSelectedPartner = async () => {
      const { data, error } = await SupabaseClient.from("partner").select("*").eq("id", value).maybeSingle();
      if (!error && data) setSelectedPartner(data as PartnerRowType);
    };

    loadSelectedPartner();
  }, [value, users]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-between h-12 dark:text-white">
          {selected ? `${selected.label} (${selected.code || "No code"})` : placeholder}
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(96vw,674px)] p-3">
        <div className="space-y-3">
          <div className="md:grid grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto rounded-md bg-white dark:bg-[#1E1E1E]">
            {options.length ? (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#FCF6E6] dark:hover:bg-[#2A2A2A] border dark:border-G20-darkGold  rounded-md"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label} ({option.code || "No code"})
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-sm text-center text-muted-foreground">No partner found.</div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Showing top {options.length} matches of {tableDataCount} partner(s)
          </div>

          <DynamicFilter
            name="Filter Partners"
            filterType="Partner"
            allow="Admin"
            paymentType="PartnerSearchSelect"
            tableName="partner"
            updateTableData={(data) => setUsers(data as PartnerRowType[])}
            updateTableDataCount={setTableDataCount}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            refreshData={refreshData}
            showPills={false}
            showSearch
            expandable
            lockedFilters={lockedFilters}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
