import { useAppSelector } from "@/redux/hooks";
import { ReactNode, useEffect, useState } from "react";
import { Database, SearchX, List, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorldCurrenciesOptions } from "@/constants/currencies";
import { RemissionMetrics } from "@/supabase/rpcTypes";
import { allChaptersOption, initialiseAdminOptions, initialRemissionsData } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";
import FetchGBPExchangeRatesValue, { FetchGBPExchangeRates } from "@/lib/fetchGBPExchangeRatesValue";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import SupabaseClient from "@/supabase/supabaseConnection";
import { useNavigate } from "react-router";
import {
  addFiltersToRemissionsMetrics,
  defaultRemissionTotal,
  getMonthYearOptionsSinceDec2025,
  rebaseRemissionTotalsToCurrency,
  RemissionTotalsRow,
} from "@/lib/transformMetricsData";
import dayjs from "dayjs";

export const RemissionsOverview = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("GBP");
  const [remissionBreakdown, setRemissionBreakdown] = useState<RemissionTotalsRow[]>([]);
  const [remissionTotal, setRemissionTotal] = useState<RemissionTotalsRow>(defaultRemissionTotal);
  const [conversionRate, setConversionRate] = useState<number>(1);
  const appState = useAppSelector((state) => state.app);

  const { DivisionOptions, ChapterOptions } = initialiseAdminOptions(appState);
  const [selectedDivision, setSelectedDivision] = useState<string>(DivisionOptions[0]?.value);
  const [selectedChapter, setSelectedChapter] = useState<string>(ChapterOptions[0]?.value);
  const [remissionPeriod, setRemissionPeriod] = useState(dayjs().format("MMMM YYYY"));

  const [remissionsData, setRemissionsData] = useState<RemissionMetrics>(initialRemissionsData);

  const RemissionPeriodOptions = getMonthYearOptionsSinceDec2025();

  const resetFilter = () => {
    setSelectedDivision(DivisionOptions[0]?.value);
    setSelectedChapter(ChapterOptions[0]?.value);
    setRemissionPeriod(RemissionPeriodOptions[0]);
  };

  const navToDetails = (filters: Record<string, any>, navTo: string) => {
    const accessMetrics = { selectedDivision, selectedChapter };
    navigate(navTo, { state: { metricsFilters: { ...accessMetrics, ...filters } } });
  };

  const fetchRemissionsStat = async () => {
    const { data, error }: PostgrestSingleResponse<RemissionMetrics> = await SupabaseClient.rpc("get_remission_metrics_filtered", {
      input_division_id: selectedDivision === "all" ? null : selectedDivision || null,
      input_chapter_id: selectedChapter === "all" ? null : selectedChapter || null,
    });

    if (data && !error) {
      const transformedData = addFiltersToRemissionsMetrics(data);
      setRemissionsData(transformedData);
    }
  };

  const fetchMonthlyRemissionsValue = async () => {
    const { data, error }: PostgrestSingleResponse<any> = await SupabaseClient.rpc("get_remission_totals_by_period", {
      p_remission_period: remissionPeriod || RemissionPeriodOptions[0],
      p_division_id: selectedDivision === "all" ? null : selectedDivision || null,
      p_chapter_id: selectedChapter === "all" ? null : selectedChapter || null,
    });

    setRemissionBreakdown(data);

    if (error) {
      return {
        desiredCurrencyBase: "Nil",
        total: "Come out",
        // optional diagnostics so you can show warnings in UI
        missingCurrencies: Array.from(new Set([])),
        sumInRatesBaseCurrency: 0,
      };
    }

    const rates = await FetchGBPExchangeRates();

    const selectedCurrencySummary = rebaseRemissionTotalsToCurrency({
      totals: data,
      rates,
      desiredCurrencyBase: currency?.toLowerCase(),
    });
    setRemissionTotal(selectedCurrencySummary || defaultRemissionTotal);
  };

  const fetchConversionRate = async () => {
    const conversionRate = await FetchGBPExchangeRatesValue(currency);

    if (conversionRate) {
      setConversionRate(conversionRate);
    }
  };

  const MetricCard = ({
    label,
    value,
    navTo,
    defaultQuery,
    showTooltip = false,
  }: {
    label: string;
    value: string | ReactNode;
    navTo?: string;
    defaultQuery?: any;
    showTooltip?: boolean;
  }) => {
    return (
      <div className="flex flex-col justify-between border border-[#CCA33D80] rounded-xl p-4 h-[135px] min-w-[220px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="h-8 w-8 rounded-full bg-[#FFF8E5] flex justify-center items-center">
              <Database className="w-[16px] h-[16px] text-GGP-darkGold" />
            </div>
            <p className="text-base font-normal dark:text-white text-[#171721]">{label}</p>
          </div>
          {showTooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={16} className="text-gray-500 dark:text-white cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>Approximate Value of {label}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <p
            className={`text-2xl font-semibold text-primary ${navTo && "hover:cursor-pointer hover:underline hover:font-bold"}`}
            onClick={() => navTo && navToDetails(defaultQuery || {}, navTo)}
          >
            {value}
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchConversionRate();
  }, [currency]);

  useEffect(() => {
    fetchRemissionsStat();
  }, [selectedDivision, selectedChapter]);

  useEffect(() => {
    fetchMonthlyRemissionsValue();
  }, [selectedDivision, selectedChapter, remissionPeriod, currency]);

  return (
    <section className=" ">
      {/* <div className="flex flex-column md:flex-row justify-between items-center"> */}
      <div className="md:flex justify-between items-center mb-4">
        <Select
          onValueChange={(value) => {
            setCurrency(value);
          }}
          defaultValue={"GBP"}
        >
          <SelectTrigger className="w-full md:w-60 shad-select-trigger">
            <List /> <SelectValue placeholder="Select display currency" />
          </SelectTrigger>
          <SelectContent className="shad-select-content">
            {WorldCurrenciesOptions.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                <div className="flex items-center cursor-pointer gap-3">
                  <p>{currency.label}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="sm:grid sm:grid-cols-2 xl:flex xl:flex-wrap space-y-2 sm:space-y-0 gap-4 mb-4 justify-end items-center my-2 xl:my-0">
          <Select
            onValueChange={(value) => {
              setSelectedDivision(value);
              const filteredChapters = ChapterOptions.filter((chapter) => chapter.filt === value);
              const finalChapterOptions = filteredChapters?.length > 1 ? [allChaptersOption, ...ChapterOptions] : ChapterOptions;
              setSelectedChapter(finalChapterOptions[0].value);
            }}
            value={selectedDivision}
          >
            <SelectTrigger className="w-full  xl:w-40 shad-select-trigger">
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

          <Select onValueChange={setSelectedChapter} value={selectedChapter}>
            <SelectTrigger className="xl:w-40 w-full shad-select-trigger">
              <SelectValue placeholder="Select Chapter" />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              {(ChapterOptions.filter((chapter) => chapter.filt === selectedDivision)?.length > 1
                ? [allChaptersOption, ...ChapterOptions.filter((chapter) => chapter.filt === selectedDivision)]
                : ChapterOptions.filter((chapter) => chapter.filt === selectedDivision)
              ).map((chapter) => (
                <SelectItem key={chapter.value || "all"} value={chapter.value}>
                  {chapter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setRemissionPeriod} value={remissionPeriod}>
            <SelectTrigger className="xl:w-40 w-full shad-select-trigger">
              <SelectValue placeholder="Select Remission Month" />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              {RemissionPeriodOptions.map((remissionPeriod) => (
                <SelectItem key={remissionPeriod} value={remissionPeriod}>
                  {remissionPeriod}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex sm:hidden xl:flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <SearchX onClick={resetFilter} />
                </TooltipTrigger>
                <TooltipContent>Clear Filter</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4"> */}
      <div className="space-y-6">
        <div className="space-y-3">
          {/* Section Title */}
          <h3 className="text-lg font-semibold dark:text-white text-[#171721]">Monthly Remission Value</h3>

          {/* Grid Layout */}
          <div className="space-y-3">
            {[remissionTotal].map((l) => {
              const { currency = "GBP", total_value = 0, online_value = 0, offline_value = 0, total_count = 0, online_count = 0 } = l;

              return (
                <div key={"total"}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                    <MetricCard label="Total" value={numberWithCurrencyFormatter(currency, +total_value)} />
                    <MetricCard label="Online" value={numberWithCurrencyFormatter(currency, +online_value)} />
                    <MetricCard label="Offline" value={numberWithCurrencyFormatter(currency, +offline_value)} />
                    <MetricCard
                      label="Count"
                      value={
                        <div>
                          {total_count} <span className="opacity-70">({online_count} online)</span>
                        </div>
                      }
                    />
                  </div>
                </div>
              );
            })}

            {remissionBreakdown.length > 1 &&
              remissionBreakdown.map((remissionItem) => {
                const { currency = "GBP", total_value = 0, online_value = 0, offline_value = 0, total_count = 0, online_count = 0 } = remissionItem;

                return (
                  <div key={currency}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4 border-t-2 border-dashed border-GGP-darkGold pt-2">
                      <MetricCard label={`${currency.toUpperCase()} Remissions  Breakdown`} value={numberWithCurrencyFormatter(currency, +total_value)} />
                      <MetricCard label={`Online ${currency.toUpperCase()} Breakdown`} value={numberWithCurrencyFormatter(currency, +online_value)} />
                      <MetricCard label={`Offline ${currency.toUpperCase()} Breakdown`} value={numberWithCurrencyFormatter(currency, +offline_value)} />
                      <MetricCard
                        label={` ${currency.toUpperCase()} Count Breakdown`}
                        value={
                          <div>
                            {total_count} <span className="opacity-70">({online_count} online)</span>
                          </div>
                        }
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* {(["Pending_Remissions", "Payment_Inflow", "Annual_Payment_Overview"] as Array<keyof RemissionMetrics>).map((key) => { */}
        {(["Pending_Remissions", "Payment_Inflow"] as Array<keyof RemissionMetrics>).map((key) => {
          const items = remissionsData[key];
          const gridCols = items.length === 2 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-3 lg:grid-cols-3";

          return (
            <div key={key} className="space-y-3">
              {/* Section Title */}
              <h3 className="text-lg font-semibold dark:text-white text-[#171721]">{key.split("_").join(" ")}</h3>

              {/* Grid Layout */}
              <div className={`grid ${gridCols} gap-4`}>
                {items.map((item) => (
                  <MetricCard
                    label={item.title}
                    value={item.convertCurrency ? numberWithCurrencyFormatter(currency, item.value * conversionRate) : item.value}
                    navTo={item.navTo}
                    defaultQuery={item.defaultQuery || {}}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
