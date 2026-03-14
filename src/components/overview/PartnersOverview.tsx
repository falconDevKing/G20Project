import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { SearchX, Info, Users, List } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allChaptersOption, allPresidentsOption, allGovernorsOption, allShepherdsOption, initialiseAdminOptions, initialPartnersData } from "@/lib/utils";
import SupabaseClient from "@/supabase/supabaseConnection";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { PartnerMetrics } from "@/supabase/rpcTypes";
import { useNavigate } from "react-router";
import { addFiltersToPartnerMetrics, rebasePartnershipTotalsToCurrency } from "@/lib/transformMetricsData";
import { FetchGBPExchangeRates } from "@/lib/fetchGBPExchangeRatesValue";
import { WorldCurrenciesOptions } from "@/constants/currencies";
import { numberWithCurrencyFormatter } from "@/lib/numberUtils";

export const PartnersOverview = () => {
  const navigate = useNavigate();
  const appState = useAppSelector((state) => state.app);

  const user = useAppSelector((state) => state.auth.userDetails);
  // const pstPermission = String(user.permission_type || "").toLowerCase();
  const opsPermission = String(user.ops_permission_type || "").toLowerCase();

  const [currency, setCurrency] = useState("GBP");
  const [currencyBreakdown, setCurrencyBreakdown] = useState([]);
  const [currencyTotal, setCurrencyTotal] = useState(0);
  const { DivisionOptions, ChapterOptions, ShepherdOptions, GovernorOptions, PresidentOptions } = initialiseAdminOptions(appState);
  const [selectedDivision, setSelectedDivision] = useState<string>(DivisionOptions[0]?.value);
  const [selectedChapter, setSelectedChapter] = useState<string>(ChapterOptions[0]?.value);
  const [selectedShepherd, setSelectedShepherd] = useState<string>("all");
  const [selectedGovernor, setSelectedGovernor] = useState<string>("all");
  const [selectedPresident, setSelectedPresident] = useState<string>("all");

  const [partnersData, setPartnersData] = useState<PartnerMetrics>(initialPartnersData);

  const filteredShepherdOptions = ShepherdOptions.filter((shepherd) => (selectedDivision === "all" ? true : shepherd.division_id === selectedDivision));
  const filteredGovernorOptions = GovernorOptions.filter((governor) => {
    const matchesDivision = selectedDivision === "all" ? true : governor.division_id === selectedDivision;
    const matchesShepherd = selectedShepherd === "all" ? true : governor.shepherd_id === selectedShepherd;
    return matchesDivision && matchesShepherd;
  });
  const filteredPresidentOptions = PresidentOptions.filter((president) => {
    const matchesDivision = selectedDivision === "all" ? true : president.division_id === selectedDivision;
    const matchesShepherd = selectedShepherd === "all" ? true : president.shepherd_id === selectedShepherd;
    const matchesGovernor = selectedGovernor === "all" ? true : president.governor_id === selectedGovernor;
    return matchesDivision && matchesShepherd && matchesGovernor;
  });

  const resetFilter = () => {
    setSelectedDivision(DivisionOptions[0]?.value);
    setSelectedChapter(ChapterOptions[0]?.value);
    setSelectedShepherd("all");
    setSelectedGovernor("all");
    setSelectedPresident("all");
  };

  const navToDetails = (filters: Record<string, any>) => {
    const accessMetrics = { selectedDivision, selectedChapter, selectedShepherd, selectedGovernor, selectedPresident };
    navigate("/users", { state: { metricsFilters: { ...accessMetrics, ...filters } } });
  };

  const fetchPartnersStat = async () => {
    const { data, error }: PostgrestSingleResponse<PartnerMetrics> = await SupabaseClient.rpc("get_g20_partner_metrics_filtered", {
      input_division_id: selectedDivision === "all" ? null : selectedDivision || null,
      input_chapter_id: selectedChapter === "all" ? null : selectedChapter || null,
      input_shepherd_id: selectedShepherd === "all" ? null : selectedShepherd || null,
      input_governor_id: selectedGovernor === "all" ? null : selectedGovernor || null,
      input_president_id: selectedPresident === "all" ? null : selectedPresident || null,
    });

    if (data && !error) {
      const transformedData = addFiltersToPartnerMetrics(data);
      setPartnersData(transformedData);
    }
  };

  const fetchPartnersValue = async () => {
    const { data, error }: PostgrestSingleResponse<any> = await SupabaseClient.rpc("get_g20_partnership_totals", {
      p_division_id: selectedDivision === "all" ? null : selectedDivision || null,
      p_chapter_id: selectedChapter === "all" ? null : selectedChapter || null,
      p_shepherd_id: selectedShepherd === "all" ? null : selectedShepherd || null,
      p_governor_id: selectedGovernor === "all" ? null : selectedGovernor || null,
      p_president_id: selectedPresident === "all" ? null : selectedPresident || null,
    });

    setCurrencyBreakdown(data);

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

    const selectedCurrencySummary = rebasePartnershipTotalsToCurrency({
      totals: data,
      rates,
      desiredCurrencyBase: currency?.toLowerCase(),
    });
    setCurrencyTotal(selectedCurrencySummary?.total || 0);
  };

  useEffect(() => {
    fetchPartnersStat();
    fetchPartnersValue();
  }, [currency, selectedDivision, selectedChapter, selectedShepherd, selectedGovernor, selectedPresident]);

  return (
    <section className=" ">
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
          {!opsPermission ? (
            <>
              <Select
                onValueChange={(value) => {
                  setSelectedDivision(value);
                  const filteredChapters = ChapterOptions.filter((chapter) => chapter.filt === value);
                  const finalChapterOptions = filteredChapters?.length > 1 ? [allChaptersOption, ...ChapterOptions] : ChapterOptions;
                  setSelectedChapter(finalChapterOptions[0].value);
                  const nextShepherds = ShepherdOptions.filter((shepherd) => (value === "all" ? true : shepherd.division_id === value));
                  if (!nextShepherds.some((shepherd) => shepherd.value === selectedShepherd)) setSelectedShepherd("all");
                  const nextGovernors = GovernorOptions.filter((governor) => {
                    const matchesDivision = value === "all" ? true : governor.division_id === value;
                    const matchesShepherd = selectedShepherd === "all" ? true : governor.shepherd_id === selectedShepherd;
                    return matchesDivision && matchesShepherd;
                  });
                  if (!nextGovernors.some((governor) => governor.value === selectedGovernor)) setSelectedGovernor("all");
                  const nextPresidents = PresidentOptions.filter((president) => {
                    const matchesDivision = value === "all" ? true : president.division_id === value;
                    const matchesShepherd = selectedShepherd === "all" ? true : president.shepherd_id === selectedShepherd;
                    const matchesGovernor = selectedGovernor === "all" ? true : president.governor_id === selectedGovernor;
                    return matchesDivision && matchesShepherd && matchesGovernor;
                  });
                  if (!nextPresidents.some((president) => president.value === selectedPresident)) setSelectedPresident("all");
                }}
                value={selectedDivision}
              >
                <SelectTrigger className="xl:w-40 w-full shad-select-trigger">
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
                  {/* {ChapterOptions.filter((chapter) => chapter.filt === selectedDivision).map((chapter) => ( */}
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
            </>
          ) : (
            ""
          )}

          {opsPermission ? (
            <>
              <Select
                onValueChange={(value) => {
                  setSelectedShepherd(value);
                  const nextGovernors = GovernorOptions.filter((governor) => {
                    const matchesDivision = selectedDivision === "all" ? true : governor.division_id === selectedDivision;
                    const matchesShepherd = value === "all" ? true : governor.shepherd_id === value;
                    return matchesDivision && matchesShepherd;
                  });
                  if (!nextGovernors.some((governor) => governor.value === selectedGovernor)) setSelectedGovernor("all");
                  const nextPresidents = PresidentOptions.filter((president) => {
                    const matchesDivision = selectedDivision === "all" ? true : president.division_id === selectedDivision;
                    const matchesShepherd = value === "all" ? true : president.shepherd_id === value;
                    const matchesGovernor = selectedGovernor === "all" ? true : president.governor_id === selectedGovernor;
                    return matchesDivision && matchesShepherd && matchesGovernor;
                  });
                  if (!nextPresidents.some((president) => president.value === selectedPresident)) setSelectedPresident("all");
                }}
                value={selectedShepherd}
              >
                <SelectTrigger className="xl:w-40 w-full shad-select-trigger">
                  <SelectValue placeholder="Select Shepherd" />
                </SelectTrigger>
                <SelectContent className="shad-select-content">
                  {[allShepherdsOption, ...filteredShepherdOptions].map((shepherd) => (
                    <SelectItem key={`shepherd-${shepherd.value}`} value={shepherd.value}>
                      {shepherd.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => {
                  setSelectedGovernor(value);
                  const nextPresidents = PresidentOptions.filter((president) => {
                    const matchesDivision = selectedDivision === "all" ? true : president.division_id === selectedDivision;
                    const matchesShepherd = selectedShepherd === "all" ? true : president.shepherd_id === selectedShepherd;
                    const matchesGovernor = value === "all" ? true : president.governor_id === value;
                    return matchesDivision && matchesShepherd && matchesGovernor;
                  });
                  if (!nextPresidents.some((president) => president.value === selectedPresident)) setSelectedPresident("all");
                }}
                value={selectedGovernor}
              >
                <SelectTrigger className="xl:w-40 w-full shad-select-trigger">
                  <SelectValue placeholder="Select Governor" />
                </SelectTrigger>
                <SelectContent className="shad-select-content">
                  {[allGovernorsOption, ...filteredGovernorOptions].map((governor) => (
                    <SelectItem key={`governor-${governor.value}`} value={governor.value}>
                      {governor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>{" "}
            </>
          ) : (
            ""
          )}

          <Select onValueChange={setSelectedPresident} value={selectedPresident}>
            <SelectTrigger className="xl:w-40 w-full shad-select-trigger">
              <SelectValue placeholder="Select President" />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              {[allPresidentsOption, ...filteredPresidentOptions].map((president) => (
                <SelectItem key={`president-${president.value}`} value={president.value}>
                  {president.name}
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

      {/* TODO:  add clickable element to stats */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4"> */}
      <div className="space-y-6">
        {/* {(["Status", "GGP_Category", "Partner_Type", "Nationality"] as Array<keyof PartnerMetrics>).map((key) => { */}
        {(["Status", "G20_Category"] as Array<keyof PartnerMetrics>).map((key) => {
          const items = partnersData[key];
          const gridCols = items.length === 2 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4";

          return (
            <div key={key} className="space-y-3">
              {/* Section Title */}
              <h3 className="text-lg font-semibold dark:text-white text-[#171721]">By {key.split("_").join(" ")}</h3>

              {/* Grid Layout */}
              <div className={`grid ${gridCols} gap-4`}>
                {items.map((item) => (
                  <div key={item.title} className="flex flex-col justify-between border border-[#E0C97F] rounded-xl p-4 h-[135px] min-w-[220px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        <div className="h-8 w-8 rounded-full bg-[#FFF8E5] flex justify-center items-center">
                          <Users className="w-[16px] h-[16px] text-GGP-darkGold" />
                        </div>
                        <p className="text-base font-normal dark:text-white text-[#171721]">{item.title}</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={16} className="text-gray-500 dark:text-white cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>{item.title === "New Signups" ? "New signups in the last 3 months" : `Details about ${item.title}`}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p
                        className={`text-2xl font-semibold text-primary ${item.defaultQuery && "hover:cursor-pointer hover:underline hover:font-bold"}`}
                        onClick={() => item.defaultQuery && navToDetails(item.defaultQuery)}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="space-y-3">
          {/* Section Title */}
          <h3 className="text-lg font-semibold dark:text-white text-[#171721]">Total Signup Value</h3>

          {/* Grid Layout */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4`}>
            <div className="flex flex-col justify-between border border-[#E0C97F] rounded-xl p-4 h-[135px] min-w-[220px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <div className="h-8 w-8 rounded-full bg-[#FFF8E5] flex justify-center items-center">
                    <Users className="w-[16px] h-[16px] text-GGP-darkGold" />
                  </div>
                  <p className="text-base font-normal dark:text-white text-[#171721]">Total Signup Value</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={16} className="text-gray-500 dark:text-white cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>Approximate Value of signups</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className={`text-2xl font-semibold text-primary `}>{numberWithCurrencyFormatter(currency, currencyTotal)}</p>
              </div>
            </div>

            {currencyBreakdown?.length > 1 &&
              currencyBreakdown.map((currencyItem: any) => {
                const { currency, total_value } = currencyItem;
                return (
                  <div className="flex flex-col justify-between border border-[#E0C97F] rounded-xl p-4 h-[135px] min-w-[220px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        <div className="h-8 w-8 rounded-full bg-[#FFF8E5] flex justify-center items-center">
                          <Users className="w-[16px] h-[16px] text-GGP-darkGold" />
                        </div>
                        <p className="text-base font-normal dark:text-white text-[#171721]">Breakdown {currency} Value</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={16} className="text-gray-500 dark:text-white cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>Approximate Value of signups</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-2xl font-semibold text-primary `}>{numberWithCurrencyFormatter(currency, total_value)}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};
