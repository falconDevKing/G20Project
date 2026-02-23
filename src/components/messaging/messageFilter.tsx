import { useCallback, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { initialiseAdminOptions, StatusOptions, cn, allChaptersOption } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, SearchX } from "lucide-react";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SupabaseClient from "@/supabase/supabaseConnection";
import { formatDateToMMDD } from "@/lib/numberUtils";
import { useSmartDebounce } from "@/hooks/useSmartDebounce";
import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";

interface MessageFilterInterface {
  updateTableData: (data: PartnerRowType[]) => void;
  updateTableDataCount: (data: number) => void;
  getFilterData: (data: Record<string, any>) => void;
}

const PAGE_SIZE = 10;
const page = 1;

export const MessageFilter = ({ updateTableData, updateTableDataCount, getFilterData }: MessageFilterInterface) => {
  const appState = useAppSelector((state) => state.app);
  const adminLoading = useAppSelector((state) => state.payment.adminLoading);
  const dataLoading = appState.usersLoading || adminLoading || false;
  const { DivisionOptions, ChapterOptions } = initialiseAdminOptions(appState);

  const [searchedName, setSearchedName] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>(DivisionOptions[0]?.value);
  const [selectedChapter, setSelectedChapter] = useState<string>(ChapterOptions[0]?.value);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [birthdayPeriod, setBirthdayPeriod] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const resetFilter = () => {
    setSearchedName("");
    setSelectedDivision(DivisionOptions[0]?.value);
    setSelectedChapter(ChapterOptions[0]?.value);
    setSelectedStatus("all");
    setBirthdayPeriod({
      from: undefined,
      to: undefined,
    });
  };

  const filterObject = {
    name_code: searchedName,
    division_id: selectedDivision,
    chapter_id: selectedChapter,
    status: selectedStatus,
    birth_day_mmdd: birthdayPeriod,
  };

  const fetchFilteredData = async (filters: Record<string, any>) => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = SupabaseClient.from("partner")
      .select("*", { count: "exact" }) // include total count for pagination
      .range(from, to);

    // Apply filters dynamically
    for (const key in filters) {
      const value = filters[key];

      if (value && value !== "all") {
        switch (key) {
          case "name_code": {
            query.ilike(key, `%${value.toLowerCase()}%`);
            continue;
          }
          case "division_id":
          case "chapter_id":
          case "status": {
            query.eq(key, value);
            continue;
          }
          case "birth_day_mmdd": {
            value.from && query.gte(key, formatDateToMMDD(value.from));
            value.to && query.lte(key, formatDateToMMDD(value.to));

            continue;
          }
          default:
            break;
        }
      }
    }

    const { data, count, error } = await query;

    if (error) throw error;

    updateTableData(data as PartnerRowType[]);
    updateTableDataCount(count || 1);
  };

  // ADD DEBOUNCE TO FILTER
  const debouncedFilter = useSmartDebounce(() => fetchFilteredData(filterObject), 500);

  const filterData = useCallback(() => {
    // listen for changes to run filter
    // setPage(1);
    !dataLoading && debouncedFilter();
    getFilterData(filterObject);
  }, [dataLoading, searchedName, selectedDivision, selectedChapter, selectedStatus, birthdayPeriod?.from, birthdayPeriod?.to, page]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  return (
    <div className="flex flex-col space-y-4 mb-7 justify-between">
      <div className="grid grid-cols-2 gap-4 mb-1 justify-end items-center my-1">
        <Select
          onValueChange={(value) => {
            setSelectedDivision(value);
            const associatedChapters = ChapterOptions.filter((chapter) => chapter.filt === value);
            setSelectedChapter(associatedChapters.length > 1 ? [allChaptersOption, ...associatedChapters][0]?.value : associatedChapters[0]?.value);
          }}
          value={selectedDivision}
        >
          <SelectTrigger className="w-full shad-select-trigger">
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
          <SelectTrigger className="w-full shad-select-trigger">
            <SelectValue placeholder="Select Chapter" />
          </SelectTrigger>
          <SelectContent className="shad-select-content">
            {[
              selectedDivision !== "all" && ChapterOptions.filter((chapter) => chapter.filt === selectedDivision).length
                ? [allChaptersOption, ...ChapterOptions.filter((chapter) => chapter.filt === selectedDivision)]
                : ChapterOptions.filter((chapter) => chapter.filt === selectedDivision),
            ]
              .flat()
              .map((chapter) => (
                <SelectItem key={chapter.value || "all"} value={chapter.value}>
                  {chapter.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-1 justify-end items-center my-1">
        <Select onValueChange={setSelectedStatus} value={selectedStatus}>
          <SelectTrigger className=" w-full shad-select-trigger">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent className="shad-select-content">
            {StatusOptions.map((status) => (
              <SelectItem key={status.value || "all"} value={status.value}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="birthdayPeriod"
              variant={"outline"}
              size="lg"
              className={cn("w-full justify-start text-left font-normal px-2", !birthdayPeriod && "text-muted-foreground")}
            >
              <CalendarIcon />
              {birthdayPeriod?.from ? (
                birthdayPeriod.to ? (
                  <>
                    {dayjs(birthdayPeriod.from).format("MMM YYYY")} - {dayjs(birthdayPeriod.to).format("MMM YYYY")}
                  </>
                ) : (
                  dayjs(birthdayPeriod.from).format("MMM YYYY")
                )
              ) : (
                <span>Birthday Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="range" defaultMonth={birthdayPeriod?.from} selected={birthdayPeriod} onSelect={setBirthdayPeriod} numberOfMonths={2} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex space-y-2 gap-4 justify-between items-center ">
        <Input
          placeholder={"Search Name or Code"}
          className="w-full focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchedName}
          onChange={(e) => setSearchedName(e.target.value)}
        />
        <div className="flex justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {/* <Trash2 onClick={resetFilter} /> */}
                <SearchX onClick={resetFilter} />
              </TooltipTrigger>
              <TooltipContent>Clear Filter</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
