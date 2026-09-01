"use client";

import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangeFilter({
  date,
  onDateChange,
}: {
  date: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
}) {
  return (
    <Field className="mx-auto w-60 ">
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              id="date-picker-range"
              className="inline-flex rounded-2xl h-9 items-center justify-start border border-input bg-background px-2.5 text-sm font-normal shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground gap-2"
            >
              <CalendarDays data-icon="inline-start" className="h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd LLL  y")} -{" "}
                    {format(date.to, "dd LLL  y")}
                  </>
                ) : (
                  format(date.from, "dd LLL  y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
