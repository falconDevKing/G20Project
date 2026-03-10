import * as React from "react";
import dayjs from "dayjs";
import { findChapterDetails, findDivisionDetails } from "@/services/payment";
import { Badge } from "@/components/ui/badge";
import { filterFieldsLabels, OperatorSymbols } from "./filterOptions";
import { useTheme } from "../themeProvider/theme-provider";
import { CapitaliseText } from "@/lib/textUtils";

type DateRange = { from?: Date; to?: Date };
type FilterValue = string | { from?: string; to?: string } | DateRange;

type Filter = {
  field: string;
  operator: string; // e.g. "Equals", "Contains", "Between"
  value: FilterValue;
};

type Props = {
  filters: Filter[];
  DivisionOptions: {
    value: string;
    name: string;
  }[];
  ChapterOptions: {
    value: string;
    name: string;
    filt: string;
    currency: string;
  }[];
  // onRemove?: (index: number) => void;
  // onClearAll?: () => void;
  // // Optional label mappers if you want friendlier names:
  // fieldLabels?: Record<string, string>;
  // operatorSymbols?: Record<string, string>; // e.g. { Equals: "=", Contains: "∋", Between: "…" }
};

const isRange = (v: FilterValue): v is DateRange => !!v && typeof v === "object" && ("from" in v || "to" in v);

const fmtFirstDate = (r: DateRange, type: string): string => {
  const dateFormat = type === "birth_day_mmdd" ? "DD-MMM" : type === "remission_period" ? "MMM YYYY" : "MMM DD, YYYY";
  const f = r.from ? dayjs(r.from).format(dateFormat) : "";
  if (f) return f;

  return "";
};

const fmtRange = (r: DateRange, type: string): string => {
  const dateFormat = type === "birth_day_mmdd" ? "DD-MMM" : type === "remission_period" ? "MMM YYYY" : "MMM DD, YYYY";
  const f = r.from ? dayjs(r.from).format(dateFormat) : "";
  const t = r.to ? dayjs(r.to).format(dateFormat) : "";
  if (f && t) return `${f} – ${t}`;
  if (f) return f;
  if (t) return t;
  return "";
};

const toOrdinal = (n: number): string => {
  if (n < 1 || n > 31) {
    return "";
  }

  if (n % 100 >= 11 && n % 100 <= 13) {
    return `${n}th`;
  }

  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
};

const ordinalRange = ({ from, to }: { from: string; to: string }): string => {
  return `${toOrdinal(+from)} - ${toOrdinal(+to)}`;
};

export const FilterPills: React.FC<Props> = ({ filters }) => {
  const { theme } = useTheme();
  if (!filters?.length) return null;

  return (
    <div>
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        {filters.map((f, i) => {
          const labelField = filterFieldsLabels[f.field] ?? f.field;
          const op = OperatorSymbols[f.operator] ?? f.operator;

          const isChapter = f.field === "chapter_id";
          const isDivision = f.field === "division_id";
          const isPreferredRemissionDay = f.field === "preferred_remission_day";
          const isEquals = op === "=";

          const isPreferredRemissionDayValue = !isPreferredRemissionDay
            ? ""
            : typeof f.value === "string"
              ? toOrdinal(+f.value)
              : ordinalRange(f.value as { from: string; to: string });

          const valueText = isPreferredRemissionDay
            ? isPreferredRemissionDayValue
            : isRange(f.value)
              ? isEquals
                ? fmtFirstDate(f.value, f.field)
                : fmtRange(f.value, f.field)
              : String(f.value ?? "").trim();

          // Skip empty values to avoid blank pills
          if (!valueText) return null;

          const textToUse =
            valueText === "all"
              ? valueText
              : isChapter
                ? findChapterDetails(valueText).chapterName
                : isDivision
                  ? findDivisionDetails(valueText).divisionName
                  : valueText;

          return (
            <Badge
              key={`${f.field}-${i}`}
              variant={theme === "light" ? "default" : "custom"}
              className="flex items-center gap-2 px-3 py-2 text-md"
              title={`${labelField} ${f.operator} ${valueText}`}
            >
              <span className="whitespace-nowrap">
                <strong>{labelField}</strong> {op} {CapitaliseText(textToUse || "")}
              </span>
              {/* <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 hover:bg-transparent"
              // onClick={() => onRemove(i)}
              aria-label={`Remove ${labelField} filter`}
              title="Remove filter"
            >
              <X className="h-4 w-4" />
            </Button> */}
            </Badge>
          );
        })}
      </div>
      <div className="sm:hidden">
        <Badge
          variant={theme === "light" ? "default" : "custom"}
          className="flex items-center gap-2 px-3 py-2 text-md max-w-max my-1"
          title={`${filters.length} filter(s) applied`}
        >
          {filters.length} filter(s) applied
        </Badge>
      </div>
    </div>
  );
};
