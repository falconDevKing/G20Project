import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { SelectRangeEventHandler } from "react-day-picker";

type DateRange = { from: Date | undefined; to?: Date | undefined };

export const isRange = (v: unknown): v is DateRange => !!v && typeof v === "object" && ("from" in (v as any) || "to" in (v as any));

type RangePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  months?: number;
  type: string;
};

export const RangePicker: React.FC<RangePickerProps> = ({ type, value, onChange, placeholder = "Select range", className, months = 2 }) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (range: DateRange) => {
    onChange(range);
    if (range?.from && range?.to) setOpen(false); // auto-close when range complete
  };

  const dateFormat = type === "birth_day_mmdd" ? "DD-MMM" : type === "remission_period" ? "MMM YYYY" : "MMM DD, YYYY";

  return (
    <div className={cn(`${open ? "w-full" : "w-[240px]"}`, className)}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={cn("w-full justify-start text-left font-normal px-2", !value?.from && "text-muted-foreground")}
        onClick={() => setOpen((s) => !s)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value?.from ? (
          value.to ? (
            <>
              {dayjs(value.from).format(dateFormat)} – {dayjs(value.to).format(dateFormat)}
            </>
          ) : (
            dayjs(value.from).format(dateFormat)
          )
        ) : (
          <span>{placeholder}</span>
        )}
      </Button>

      {open && (
        <div
          className="mt-2 rounded-md border p-2 bg-white dark:bg-neutral-900"
          // guards in case this sits in a dialog with focus traps
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <Calendar
            mode="range"
            numberOfMonths={months}
            defaultMonth={value?.from}
            selected={value}
            onSelect={handleSelect as SelectRangeEventHandler}
            onDayClick={(day) => {
              // If a range is already complete, start a new one from this day
              if (value?.from && value?.to) {
                onChange({ from: day, to: undefined });
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
