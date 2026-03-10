import { useForm, useFieldArray, Controller, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SupabaseClient from "@/supabase/supabaseConnection";
import { Plus, X, SearchX, ListFilterPlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dynamicFilterSchema, DynamicFilterSchema } from "@/lib/schemas";
import { filterFieldsOptions, filterOperatorsOptionsCreator, FilterType, StringRange } from "./filterOptions";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  activeRecurringRemissionFilterOptions,
  allChaptersOption,
  initialiseAdminOptions,
  PaymentStatusOptions,
  ProposedStatusOptions,
  PermissionOptions,
  RemissionDayOptions,
  StatusOptions,
} from "@/lib/utils";
import { G20Categories } from "@/constants";
import { isRange, RangePicker } from "./rangePicker";
import { DateRange } from "react-day-picker";
import { FilterPills } from "./filterPills";
import { formatDateToMMDD, getRemissionsMonthsBetween } from "@/lib/numberUtils";
import { dummyFunction } from "@/interfaces/tools";
import { useLocation } from "react-router";
import dayjs from "dayjs";
import { AltDayPicker } from "./AltDayPicker";

interface DynamicFilterProps {
  name?: string;
  filterType: "Payment" | "Partner" | "Proposed";
  allow: "Individual" | "Admin";
  paymentType: string;
  tableName?: string;
  updateTableData: (data: Record<string, any>[]) => void;
  updateTableDataCount: (data: number) => void;
  page: number;
  pageSize: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getFilterData?: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
  showPills?: boolean;
  expandable?: boolean;
  refreshData?: number;
  showSearch?: boolean;
  lockedFilters?: FilterType[];
}

// const PAGE_SIZE = 10;

// TODO: fix filter to factor in division and chapter scope., and also fix sorting., look into range not satiable error for supabase
// TODO: fix filter on page change, seems to scatter the order

export const DynamicFilter = ({
  name,
  filterType,
  allow,
  tableName,
  updateTableData,
  updateTableDataCount,
  paymentType = "",
  page = 1,
  pageSize: initialPageSize,
  setPage,
  getFilterData,
  showPills = true,
  refreshData,
  showSearch = false,
  expandable = false,
  lockedFilters = [],
}: DynamicFilterProps) => {
  dummyFunction(setPage);

  const appState = useAppSelector((state) => state.app);
  const user = useAppSelector((state) => state.auth.userDetails);
  const { state } = useLocation();

  const metricsFilters = state?.metricsFilters;
  const pageSize = +initialPageSize;

  const filteredDivision = metricsFilters?.selectedDivision
    ? { field: "division_id", operator: "Equals", value: metricsFilters?.selectedDivision as filterValue }
    : null;
  const filteredChapter = metricsFilters?.selectedChapter
    ? { field: "chapter_id", operator: "Equals", value: metricsFilters?.selectedChapter as filterValue }
    : null;
  const filteredStatus = metricsFilters?.payment_date?.from
    ? { field: "payment_date", operator: "Within", value: metricsFilters?.payment_date as filterValue }
    : null;

  const pstPermission = String(user.permission_type || "").toLowerCase();
  const opsPermission = String(user.ops_permission_type || "").toLowerCase();
  const hasPstScope = ["division", "chapter"].includes(opsPermission);
  const hasOpsScope = ["hos", "governor", "president"].includes(opsPermission);
  const pstScopeField = pstPermission === "division" ? "division_id" : pstPermission === "chapter" ? "chapter_id" : "";
  const opsScopeField = opsPermission === "hos" ? "hos_id" : opsPermission === "governor" ? "governor_id" : opsPermission === "president" ? "president_id" : "";

  const filterOperatorsOptions = filterOperatorsOptionsCreator(pstPermission);
  const isPendingRemissions = paymentType === "pendingRemissions";
  const paymentStatusToUse = isPendingRemissions ? "Pending" : "all";
  const scheduleYearOptions = Array.from({ length: 10 }, (_, index) => String(2026 - index));
  const fieldsOptionsToUse = filterFieldsOptions.filter((field) => field.allow.includes(allow) && field.filterType.includes(filterType));
  const hasStatusField = fieldsOptionsToUse.some((field) => field.value === "status");
  const defaultFilterField = (hasStatusField ? "status" : fieldsOptionsToUse[0]?.value || "name_code") as DynamicFilterSchema["filters"][number]["field"];
  const defaultFilterOperator = (defaultFilterField === "name_code" ? "Contains" : "Equals") as DynamicFilterSchema["filters"][number]["operator"];
  const defaultFilterValue = (defaultFilterField === "status" ? paymentStatusToUse : "") as filterValue;
  const filteredOptions = [filteredDivision, filteredChapter, filteredStatus].filter((filter) => !!filter);

  const { DivisionOptions, ChapterOptions } = initialiseAdminOptions(appState);

  const [openDialog, setOpenDialog] = useState(false);
  const [filterPillsData, setFilterPillsData] = useState([{ field: "", operator: "", value: "" as filterValue }]);
  type dateValue = { from: Date; to: Date };
  type filterValue = string | { from: string; to: string } | dateValue;
  type fieldNameType = DynamicFilterSchema["filters"][number]["field"];
  type fieldOperatorType = DynamicFilterSchema["filters"][number]["operator"];
  // type fieldValue = DynamicFilterSchema["filters"][number]["value"];
  type Filter = { field: fieldNameType; operator: fieldOperatorType; value: filterValue };

  const { control, handleSubmit, watch, setValue, reset, getValues } = useForm<DynamicFilterSchema>({
    resolver: zodResolver(dynamicFilterSchema),
    defaultValues: {
      filters: [
        { field: defaultFilterField, operator: defaultFilterOperator, value: metricsFilters?.status || defaultFilterValue },
        ...(filteredOptions as any),
      ].filter(Boolean),
    },
  });

  const {
    fields: filterFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "filters",
  });

  const useFilterContainsUpdater = (getValues: () => DynamicFilterSchema, setValue: UseFormSetValue<DynamicFilterSchema>) => {
    return (fieldName: fieldNameType, nextValue: filterValue) => {
      const { filters } = getValues();
      const idx = filters.findIndex((f) => f.field === fieldName);

      if (idx >= 0) {
        // update existing
        setValue(`filters.${idx}.value` as const, nextValue, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      } else {
        // optionally add if not present
        const updated: Filter[] = [...filters, { field: fieldName, operator: "Contains", value: nextValue }];
        setValue("filters" as const, updated, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    };
  };

  const useFilterEqualsUpdater = (getValues: () => DynamicFilterSchema, setValue: UseFormSetValue<DynamicFilterSchema>) => {
    return (fieldName: fieldNameType, nextValue: filterValue) => {
      const { filters } = getValues();
      const idx = filters.findIndex((f) => f.field === fieldName);

      if (idx >= 0) {
        // update existing
        setValue(`filters.${idx}.value` as const, nextValue, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      } else {
        // optionally add if not present
        const updated: Filter[] = [...filters, { field: fieldName, operator: "Equals", value: nextValue }];
        setValue("filters" as const, updated, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    };
  };

  const getFilterValue = (fieldName: DynamicFilterSchema["filters"][number]["field"]) => {
    const filters = getValues("filters");
    const filter = filters.find((f) => f.field === fieldName);
    return filter?.value ?? "";
  };

  const updateContainsFilter = useMemo(() => useFilterContainsUpdater(getValues, setValue), [getValues, setValue]);

  const updateEqualsFilter = useMemo(() => useFilterEqualsUpdater(getValues, setValue), [getValues, setValue]);

  const resetFilter = () => {
    setFilterPillsData([{ field: "", operator: "", value: "" as filterValue }]);
    reset({
      filters: [{ field: defaultFilterField, operator: defaultFilterOperator, value: defaultFilterValue }],
    });
  };

  const fetchFilteredData = async (page: number, filters: FilterType[]) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const sourceTable = tableName || filterType.toLowerCase();
    const sortField = filterType === "Payment" ? "payment_date" : "created_at";
    let query = SupabaseClient.from(sourceTable)
      .select("*", { count: "exact" }) // include total count for pagination
      .range(from, to);

    if (filterType === "Proposed") {
      [
        { field: "schedule_year", ascending: false },
        { field: "proposed_date", ascending: true },
      ].forEach((sortConfig) => {
        query = query.order(sortConfig.field, { ascending: sortConfig.ascending });
      });
    } else {
      query = query.order(sortField, { ascending: false });
    }

    if (filterType === "Partner") {
      query = query.eq("g20_active", true);
    }

    if (allow === "Individual") {
      query = query.eq("user_id", user.id);
    }

    // filter admin scope
    if (hasPstScope || hasOpsScope) {
      const scopeFilters = [];

      if (hasPstScope && pstScopeField && user[pstScopeField]) scopeFilters.push(`${pstScopeField}.eq.${user[pstScopeField]}`);
      if (hasOpsScope && opsScopeField && user[opsScopeField]) scopeFilters.push(`${opsScopeField}.eq.${user[opsScopeField]}`);

      query = query.or(scopeFilters.join(","));
    }

    // paymentStatusToUse && query.eq("status", paymentStatusToUse);

    // Apply filters dynamically
    const combinedFilters = [...lockedFilters, ...filters];
    for (const filter of combinedFilters) {
      const field = filter.field;
      const resolvedField = field === "status" && sourceTable === "partner" ? "g20_status" : field;
      const operator = filter.operator;
      const value = filter.value;

      if (!value) continue;
      if (typeof value === "string" && (!value.trim() || value === "all")) continue;

      switch (operator) {
        case "Equals": {
          // string equality
          const r = value as DateRange;
          if (field === "birth_day_mmdd") {
            r.from && query.eq(resolvedField, formatDateToMMDD(r.from));
          } else if (["payment_date", "proposed_date"].includes(field)) {
            r.from && query.gte(resolvedField, new Date(r.from).toISOString().split("T")[0] + "T00:00:00.000Z");
            r.from && query.lte(resolvedField, new Date(r.from).toISOString().split("T")[0] + "T23:59:59.999Z");
          } else if (field === "status" && sourceTable === "proposed_payment_schedule" && typeof value === "string") {
            const statusValue = value.toLowerCase();
            const today = new Date().toISOString().split("T")[0];
            if (statusValue === "due") {
              query = query.eq("status", "pending").lte("proposed_date", today);
            } else {
              query = query.eq(resolvedField, statusValue);
            }
          } else if (field === "schedule_year") {
            query = query.eq(resolvedField, +value);
          } else if (field === "remission_period") {
            // array of "YYYY-MM" or similar, using your helper
            if (r.from && r.to) {
              const months = getRemissionsMonthsBetween(r.from, r.to);
              if (months?.length) query = query.in(field, months);
            }
          } else if (field === "g20_active_recurring_remission") {
            if (typeof value === "string" && ["True", "False"].includes(value)) {
              if (value === "True") {
                query = query.eq(field, true);
              } else {
                query = query.or(`${field}.eq.false,${field}.is.null`);
              }
            }
          } else if (field === "online_payment") {
            if (typeof value === "string" && ["True", "False"].includes(value)) {
              if (value === "True") {
                query = query.ilike("approved_by", "%online%");
              } else {
                query = query.or(`approved_by.not.ilike.%Online%,approved_by.is.null`);
              }
            }
          } else if (field === "preferred_remission_day") {
            query = query.eq(resolvedField, +value);
          }

          if (typeof value === "string" && !["g20_active_recurring_remission", "online_payment", "schedule_year"].includes(field)) {
            query = query.eq(resolvedField, value);
          }
          break;
        }
        case "Contains": {
          // case‑insensitive contains for strings
          if (typeof value === "string") {
            query = query.ilike(resolvedField, `%${value.toLowerCase()}%`);
          }
          break;
        }

        case "Within": {
          // date/range fields
          const r = value as DateRange;

          if (["payment_date", "proposed_date"].includes(field)) {
            r.from && query.gte(resolvedField, new Date(r.from).toISOString().split("T")[0] + "T00:00:00.000Z");
            r.to && query.lte(resolvedField, new Date(r.to).toISOString().split("T")[0] + "T23:59:59.999Z");
          } else if (field === "birth_day_mmdd") {
            r.from && query.gte(resolvedField, formatDateToMMDD(r.from));
            r.to && query.lte(resolvedField, formatDateToMMDD(r.to));
          } else if (field === "remission_period") {
            // array of "YYYY-MM" or similar, using your helper
            if (r.from && r.to) {
              const months = getRemissionsMonthsBetween(r.from, r.to);
              if (months?.length) query = query.in(field, months);
            }
          } else if (field === "preferred_remission_day") {
            const ss = value as StringRange;
            ss.from && query.gte(resolvedField, +ss.from);
            ss.to && query.lte(resolvedField, +ss.to);
          } else if (field === "schedule_year") {
            const ss = value as StringRange;
            ss.from && query.gte(resolvedField, +ss.from);
            ss.to && query.lte(resolvedField, +ss.to);
          }
          break;
        }
        case "Not Equals": {
          // string equality
          if (typeof value === "string") {
            query = query.neq(resolvedField, value);
          }
          break;
        }
      }
    }

    console.log("query", query);
    const { data, count, error } = await query;

    if (error) throw error;

    updateTableData(data);
    updateTableDataCount(count || 1);
  };

  const filterData = useCallback(async () => {
    const filterObject = watch("filters");
    setFilterPillsData(filterObject);
    await fetchFilteredData(page, filterObject);
    getFilterData && getFilterData([...(lockedFilters || []), ...filterObject]);
    // setFilterPillsData(filterObject);
  }, [page, pageSize, lockedFilters]);

  const onSubmit = async (data: DynamicFilterSchema) => {
    dummyFunction(data);
    setPage(1);
    await filterData();
    setOpenDialog(false);
  };

  const statusOptionsToUse = filterType === "Payment" ? PaymentStatusOptions : filterType === "Proposed" ? ProposedStatusOptions : StatusOptions;

  const filters = watch("filters");
  const name_Code_Value = filters.find((f) => f.field === "name_code")?.value || "";
  const outsideSelectedDivision = filters.find((f) => f.field === "division_id")?.value || "all";
  const outsideSelectedChapter = filters.find((f) => f.field === "chapter_id")?.value || "all";
  const outsideSelectedSatus = filters.find((f) => f.field === "status")?.value || "all";
  const outsideSelectedOnlinePayment = filters.find((f) => f.field === "online_payment")?.value || "all";
  const outsideSelectedActiveRecurringRemission = filters.find((f) => f.field === "g20_active_recurring_remission")?.value || "all";

  useEffect(() => {
    filterData();
  }, [
    filterData,
    refreshData,
    name_Code_Value,
    outsideSelectedDivision,
    outsideSelectedChapter,
    outsideSelectedSatus,
    outsideSelectedOnlinePayment,
    outsideSelectedActiveRecurringRemission,
  ]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <div className="hidden lg:block pb-4">
        {showPills && <FilterPills filters={filterPillsData} DivisionOptions={DivisionOptions} ChapterOptions={ChapterOptions} />}
      </div>

      <div className={`flex flex-col sm:flex-row justify-end mb-${showPills ? 6 : 0} gap-2`}>
        <div className="block lg:hidden">
          {showPills && <FilterPills filters={filterPillsData} DivisionOptions={DivisionOptions} ChapterOptions={ChapterOptions} />}
        </div>

        <div className="hidden lg:block ">
          {expandable && (
            <div className="flex gap-2 items-center">
              <Select
                value={getFilterValue("division_id") as string}
                onValueChange={(value) => {
                  updateEqualsFilter("division_id", value);

                  const chapterIndex = watch(`filters`).findIndex((filter) => filter.field === "chapter_id");
                  if (chapterIndex > -1) {
                    const associatedChapters = ChapterOptions.filter((c) => c.filt === value);
                    const nextChapter = associatedChapters.length > 1 ? allChaptersOption.value : associatedChapters[0]?.value || "";
                    setValue(`filters.${chapterIndex}.value`, nextChapter, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <SelectTrigger className="w-[140px] shad-select-trigger">
                  <SelectValue placeholder="Select Division" />
                </SelectTrigger>
                <SelectContent className="shad-select-content">
                  {DivisionOptions.map((division) => (
                    <SelectItem key={division.value || "all"} value={division.value}>
                      {division.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => {
                  updateEqualsFilter("chapter_id", value);
                }}
                value={getFilterValue("chapter_id") as string}
              >
                <SelectTrigger className="w-[140px] shad-select-trigger">
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent className="shad-select-content">
                  {[
                    outsideSelectedDivision !== "all" && ChapterOptions.filter((chapter) => chapter.filt === outsideSelectedDivision).length > 1
                      ? [allChaptersOption, ...ChapterOptions.filter((chapter) => chapter.filt === outsideSelectedDivision)]
                      : ChapterOptions.filter((chapter) => (outsideSelectedDivision === "all" ? true : chapter.filt === outsideSelectedDivision)),
                  ]
                    .flat()
                    .map((chapter) => (
                      <SelectItem key={chapter.value || "all"} value={chapter.value}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {paymentType === "PartnerSearchSelect" ? (
                ""
              ) : (
                <>
                  {isPendingRemissions ? (
                    ""
                  ) : (
                    <Select
                      onValueChange={(value) => {
                        updateEqualsFilter("status", value);
                      }}
                      value={getFilterValue("status") as string}
                    >
                      <SelectTrigger className="w-[140px] shad-select-trigger">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {statusOptionsToUse.map((status) => (
                          <SelectItem key={status.value || "all"} value={status.value}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {filterType === "Payment" && (
                    <Select
                      onValueChange={(value) => {
                        updateEqualsFilter("online_payment", value);
                      }}
                      value={getFilterValue("online_payment") as string}
                    >
                      <SelectTrigger className="w-[140px] shad-select-trigger">
                        <SelectValue placeholder={"Online Payment"} />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {activeRecurringRemissionFilterOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {filterType === "Partner" && (
                    <Select
                      onValueChange={(value) => {
                        updateEqualsFilter("g20_active_recurring_remission", value);
                      }}
                      value={getFilterValue("g20_active_recurring_remission") as string}
                    >
                      <SelectTrigger className="w-[140px] shad-select-trigger">
                        <SelectValue placeholder={"Automated Remissions"} />
                      </SelectTrigger>
                      <SelectContent className="shad-select-content">
                        {activeRecurringRemissionFilterOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {showSearch && (
          <Input
            placeholder="Seach partner by name or code"
            value={getFilterValue("name_code") as string}
            onChange={(e) => updateContainsFilter("name_code", e.target.value)}
            className="w-[200px] dark:border-GGP-lightGold"
          />
        )}

        {/* Add expanded filter on large screen that isnt messaging using an expandable filter */}

        <DialogTrigger asChild className="xl:my-0">
          <Button
            size={"lg"}
            variant="outline"
            className={`w-full dark:border-[#EDEDED24] md:w-auto ${showSearch ? "text-black bg-white" : ""}`}
            onClick={() => setOpenDialog(true)}
          >
            <ListFilterPlus className="" />
            {name || "Filter Table"}
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="bg-white dark:bg-[#1E1E1E]">
        <div className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isPendingRemissions
              ? filterFields
                  .filter((filter) => filter.field === "status")
                  .map((item, index) => {
                    const selectedField = watch(`filters.${index}.field`);

                    return (
                      <div key={item.id} className="flex gap-2 items-center flex-wrap justify-between">
                        {/* Field Dropdown */}
                        <Controller
                          control={control}
                          name={`filters.${index}.field`}
                          render={({ field }) => (
                            <Select disabled={isPendingRemissions} onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-[176px] h-12">
                                <SelectValue placeholder="Select Field" />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldsOptionsToUse.map((f) => (
                                  <SelectItem key={f.value} value={f.value}>
                                    {f.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />

                        {/* Operator Dropdown */}
                        <Controller
                          control={control}
                          name={`filters.${index}.operator`}
                          render={({ field }) => (
                            <Select disabled={isPendingRemissions} onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-[132px] h-12">
                                <SelectValue placeholder="Select Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {filterOperatorsOptions[selectedField as keyof typeof filterOperatorsOptions].map((op) => (
                                  <SelectItem key={op} value={op}>
                                    {op}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />

                        {/* Value Input */}
                        <Controller
                          control={control}
                          name={`filters.${index}.value`}
                          render={({ field }) => {
                            return (
                              <Select disabled={isPendingRemissions} onValueChange={field.onChange} value={field.value as string}>
                                <SelectTrigger className="w-[240px] shad-select-trigger">
                                  <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                  {statusOptionsToUse.map((status) => (
                                    <SelectItem key={status.value || "all"} value={status.value}>
                                      {status.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            );
                          }}
                        />

                        {/* Remove Button */}
                        {filterFields.length > 1 && (
                          <Button type="button" variant="destructive" size="icon" disabled>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })
              : ""}
            {filterFields
              .filter((filter) => (isPendingRemissions ? filter.field !== "status" : true))
              .map((item, index) => {
                const indexToUse = isPendingRemissions ? index + 1 : index;
                const fieldOptions = watch("filters").map((filter) => filter.field as string);
                const selectedField = watch(`filters.${indexToUse}.field`);
                const selectedDivision = watch(`filters`).find((filter) => filter.field === "division_id")?.value || "all";
                const isEqualsOperator = watch(`filters.${indexToUse}.operator`) === "Equals";

                return (
                  <div key={item.id} className={`flex gap-2 items-${isEqualsOperator ? "start" : "center"} flex-wrap justify-between`}>
                    {/* Field Dropdown */}
                    <Controller
                      control={control}
                      name={`filters.${indexToUse}.field`}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-[176px] h-12">
                            <SelectValue placeholder="Select Field" />
                          </SelectTrigger>
                          <SelectContent>
                            {[fieldsOptionsToUse]
                              .flat()
                              .filter((field) => (isPendingRemissions ? field.value !== "status" : true))
                              .map((f) => (
                                <SelectItem key={f.value} value={f.value} disabled={fieldOptions.includes(f.value)}>
                                  {f.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {/* Operator Dropdown */}
                    <Controller
                      control={control}
                      name={`filters.${indexToUse}.operator`}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-[132px] h-12">
                            <SelectValue placeholder="Select Operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOperatorsOptions[selectedField as keyof typeof filterOperatorsOptions].map((op) => (
                              <SelectItem key={op} value={op}>
                                {op}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {/* Value Input */}
                    {["payment_date", "proposed_date"].includes(selectedField) ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          if (isEqualsOperator) {
                            const value = isRange(field.value) ? field.value : undefined; // coerce safely
                            return (
                              <AltDayPicker
                                value={value?.from as Date}
                                placeholder={selectedField === "payment_date" ? "Payment Date" : "Proposed Date"}
                                months={1}
                                type={selectedField}
                                onChange={(date) =>
                                  field.onChange(
                                    date
                                      ? {
                                          from: new Date(dayjs(date).add(6, "hours").toISOString().split("T")[0] + "T12:00:00.000Z"),
                                          to: new Date(dayjs(date).add(6, "hours").toISOString().split("T")[0] + "T12:00:00.000Z"),
                                        }
                                      : { from: undefined, to: undefined },
                                  )
                                }
                              />
                            );
                          } else {
                            const value = isRange(field.value) ? field.value : undefined; // coerce safely
                            return (
                              <RangePicker
                                value={value as DateRange}
                                onChange={field.onChange}
                                placeholder={selectedField === "payment_date" ? "Payment Date" : "Proposed Date"}
                                months={2}
                                type={selectedField}
                              />
                            );
                          }
                        }}
                      />
                    ) : selectedField === "schedule_year" ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          return isEqualsOperator ? (
                            <Select onValueChange={field.onChange} value={field.value as string}>
                              <SelectTrigger className="w-[240px] shad-select-trigger">
                                <SelectValue placeholder="Select Scheduled Year" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {scheduleYearOptions.map((year) => (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center justify-evenly gap-1">
                              <Select
                                value={(field.value as StringRange)?.from || ""}
                                onValueChange={(value) => {
                                  setValue(
                                    `filters.${indexToUse}.value`,
                                    { ...(watch(`filters.${indexToUse}.value`) as StringRange), from: value } as { from: string; to: string },
                                    { shouldDirty: true, shouldValidate: true },
                                  );
                                }}
                              >
                                <SelectTrigger className="w-[120px] shad-select-trigger">
                                  <SelectValue placeholder="From" />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                  {scheduleYearOptions.map((year) => (
                                    <SelectItem key={`from-${year}`} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              -
                              <Select
                                value={(field.value as StringRange)?.to || ""}
                                onValueChange={(value) => {
                                  setValue(
                                    `filters.${indexToUse}.value`,
                                    { ...(watch(`filters.${indexToUse}.value`) as StringRange), to: value } as { from: string; to: string },
                                    { shouldDirty: true, shouldValidate: true },
                                  );
                                }}
                              >
                                <SelectTrigger className="w-[120px] shad-select-trigger">
                                  <SelectValue placeholder="To" />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                  {scheduleYearOptions.map((year) => (
                                    <SelectItem key={`to-${year}`} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          );
                        }}
                      />
                    ) : selectedField === "birth_day_mmdd" ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          if (isEqualsOperator) {
                            const value = isRange(field.value) ? field.value : undefined; // coerce safely
                            return (
                              <AltDayPicker
                                value={value?.from as Date}
                                placeholder="Birth Day (Day Month)"
                                months={1}
                                type={selectedField}
                                onChange={(date) =>
                                  field.onChange(
                                    date
                                      ? {
                                          from: new Date(dayjs(date).add(6, "hours").toISOString().split("T")[0] + "T12:00:00.000Z"),
                                          to: new Date(dayjs(date).add(6, "hours").toISOString().split("T")[0] + "T12:00:00.000Z"),
                                        }
                                      : { from: undefined, to: undefined },
                                  )
                                }
                              />
                            );
                          } else {
                            const value = isRange(field.value) ? field.value : undefined;
                            return (
                              <RangePicker
                                value={value as DateRange}
                                onChange={field.onChange}
                                placeholder="Birth Day (Day Month)"
                                months={2}
                                type={selectedField}
                              />
                            );
                          }
                        }}
                      />
                    ) : selectedField === "remission_period" ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          if (isEqualsOperator) {
                            const value = isRange(field.value) ? field.value : undefined; // coerce safely
                            return (
                              <AltDayPicker
                                value={value?.from as Date}
                                placeholder="Remission"
                                months={1}
                                type={selectedField}
                                onChange={(date) =>
                                  field.onChange(
                                    date
                                      ? {
                                          from: new Date(dayjs(date).add(6, "hours").toISOString().split("T")[0] + "T12:00:00.000Z"),
                                          to: new Date(dayjs(date).add(6, "hours").toISOString().split("T")[0] + "T12:00:00.000Z"),
                                        }
                                      : { from: undefined, to: undefined },
                                  )
                                }
                              />
                            );
                          } else {
                            const value = isRange(field.value) ? field.value : undefined;
                            return <RangePicker value={value as DateRange} onChange={field.onChange} placeholder="Remission" months={2} type={selectedField} />;
                          }
                        }}
                      />
                    ) : selectedField === "g20_category" ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          return (
                            <Select onValueChange={field.onChange} value={field.value as string}>
                              <SelectTrigger className="w-[240px] shad-select-trigger">
                                <SelectValue placeholder={`Select the G20 category`} />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {G20Categories.map((category) => (
                                  <SelectItem key={category.value || category.name} value={String(category.value)}>
                                    <div className="flex items-center cursor-pointer gap-2 pl-4">{category.name}</div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                    ) : selectedField === "permission_type" ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          return (
                            <Select onValueChange={field.onChange} value={field.value as string}>
                              <SelectTrigger className="w-[240px] shad-select-trigger">
                                <SelectValue placeholder="Select the Admin Level" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {PermissionOptions.filter((option) => option.allow.includes(pstPermission)).map((permissionOption) => (
                                  <SelectItem key={permissionOption.value} value={permissionOption.value}>
                                    <div className="flex items-center cursor-pointer gap-3">
                                      <p>{permissionOption.name}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                    ) : selectedField === "status" ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          return (
                            <Select onValueChange={field.onChange} value={field.value as string}>
                              <SelectTrigger className="w-[240px] shad-select-trigger">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {statusOptionsToUse.map((status) => (
                                  <SelectItem key={status.value || "all"} value={status.value}>
                                    {status.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                    ) : ["g20_active_recurring_remission", "online_payment"].includes(selectedField) ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          return (
                            <Select onValueChange={field.onChange} value={field.value as string}>
                              <SelectTrigger className="w-[240px] shad-select-trigger">
                                <SelectValue placeholder={selectedField === "g20_active_recurring_remission" ? "Automated Remissions" : "Online Payment"} />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {activeRecurringRemissionFilterOptions.map((status) => (
                                  <SelectItem key={status.value} value={status.value}>
                                    {status.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                    ) : selectedField === "preferred_remission_day" ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          return isEqualsOperator ? (
                            <Select onValueChange={field.onChange} value={field.value as string}>
                              <SelectTrigger className="w-[240px] shad-select-trigger">
                                <SelectValue placeholder="Preferred Remission Day" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {RemissionDayOptions.map((remissionDayOption) => (
                                  <SelectItem key={remissionDayOption} value={remissionDayOption}>
                                    {remissionDayOption}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center justify-evenly gap-1">
                              <Select
                                onValueChange={(value) => {
                                  setValue(
                                    `filters.${indexToUse}.value`,
                                    { ...(watch(`filters.${indexToUse}.value`) as StringRange), from: value } as { from: string; to: string },
                                    {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    },
                                  );
                                }}
                                value={(field.value as StringRange).from}
                              >
                                <SelectTrigger className="w-[120px] shad-select-trigger">
                                  <SelectValue placeholder="Remitting from" />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                  {RemissionDayOptions.map((remissionDayOption) => (
                                    <SelectItem key={remissionDayOption} value={remissionDayOption}>
                                      {remissionDayOption}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>{" "}
                              -
                              <Select
                                onValueChange={(value) => {
                                  setValue(
                                    `filters.${indexToUse}.value`,
                                    { ...(watch(`filters.${indexToUse}.value`) as StringRange), to: value } as { from: string; to: string },
                                    {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    },
                                  );
                                }}
                                value={(field.value as StringRange).to}
                              >
                                <SelectTrigger className="w-[120px] shad-select-trigger">
                                  <SelectValue placeholder="Remitting to" />
                                </SelectTrigger>
                                <SelectContent className="shad-select-content">
                                  {RemissionDayOptions.map((remissionDayOption) => (
                                    <SelectItem key={remissionDayOption} value={remissionDayOption}>
                                      {remissionDayOption}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          );
                        }}
                      />
                    ) : selectedField === "division_id" ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          return (
                            <Select
                              value={field.value as string}
                              onValueChange={(value) => {
                                field.onChange(value);

                                const chapterIndex = watch(`filters`).findIndex((filter) => filter.field === "chapter_id");
                                if (chapterIndex > -1) {
                                  const associatedChapters = ChapterOptions.filter((c) => c.filt === value);
                                  const nextChapter = associatedChapters.length > 1 ? allChaptersOption.value : associatedChapters[0]?.value || "";
                                  setValue(`filters.${chapterIndex}.value`, nextChapter, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                }
                              }}
                            >
                              <SelectTrigger className="w-[240px] shad-select-trigger">
                                <SelectValue placeholder="Select Division" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {DivisionOptions.map((division) => (
                                  <SelectItem key={division.value || "all"} value={division.value}>
                                    {division.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                    ) : selectedField === "chapter_id" ? (
                      <Controller
                        control={control}
                        name={`filters.${indexToUse}.value`}
                        render={({ field }) => {
                          return (
                            <Select onValueChange={field.onChange} value={field.value as string}>
                              <SelectTrigger className="w-[240px] shad-select-trigger">
                                <SelectValue placeholder="Select Chapter" />
                              </SelectTrigger>
                              <SelectContent className="shad-select-content">
                                {[
                                  selectedDivision !== "all" && ChapterOptions.filter((chapter) => chapter.filt === selectedDivision).length > 1
                                    ? [allChaptersOption, ...ChapterOptions.filter((chapter) => chapter.filt === selectedDivision)]
                                    : ChapterOptions.filter((chapter) => (selectedDivision === "all" ? true : chapter.filt === selectedDivision)),
                                ]
                                  .flat()
                                  .map((chapter) => (
                                    <SelectItem key={chapter.value || "all"} value={chapter.value}>
                                      {chapter.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          );
                        }}
                      />
                    ) : (
                      <Input className="w-[240px] h-12" {...control.register(`filters.${indexToUse}.value`)} placeholder="Enter keyword" />
                    )}

                    {/* Remove Button */}
                    {filterFields.length > 1 && (
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(indexToUse)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}

            {/* Add & Apply Buttons */}
            <div className="flex gap-2 justify-between">
              <Button type="button" variant="destructive" onClick={resetFilter}>
                <SearchX className="w-4 h-4 mr-1" /> Clear Filter
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" className="text-black bg-white" onClick={() => append({ field: "name_code", operator: "Contains", value: "" })}>
                  <Plus className="w-4 h-4 mr-1" /> Add Filter
                </Button>
                <Button variant={"custom"} type="submit">
                  Apply Filter
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
