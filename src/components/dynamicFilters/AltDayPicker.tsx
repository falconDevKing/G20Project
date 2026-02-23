import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { SelectSingleEventHandler } from "react-day-picker";

type DateRange = { from: Date | undefined; to?: Date | undefined };

export const isRange = (v: unknown): v is DateRange => !!v && typeof v === "object" && ("from" in (v as any) || "to" in (v as any));

type AltDayPickerProps = {
  value: Date;
  onChange: (range: Date) => void;
  placeholder?: string;
  className?: string;
  months?: number;
  type: string;
};

export const AltDayPicker: React.FC<AltDayPickerProps> = ({ type, value, onChange, placeholder = "Select range", className, months = 1 }) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (range: Date) => {
    onChange(range);
    setOpen(false); // auto-close when range complete
  };

  const dateFormat = type === "birth_day_mmdd" ? "DD-MMM" : type === "remission_period" ? "MMM YYYY" : "MMM DD, YYYY";

  return (
    <div className={cn(`${open ? "w-[240px]ull" : "w-[240px]"}`, className)}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={cn("w-full justify-start text-left font-normal px-2", !value && "text-muted-foreground")}
        onClick={() => setOpen((s) => !s)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? (
          dayjs(value).format(dateFormat)
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
            mode="single"
            numberOfMonths={months}
            defaultMonth={value}
            selected={value}
            onSelect={handleSelect as SelectSingleEventHandler}
            onDayClick={onChange}
          />
        </div>
      )}
    </div>
  );
};
