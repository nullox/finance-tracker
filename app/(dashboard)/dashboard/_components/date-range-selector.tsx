import React from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { differenceInDays } from "date-fns";
import { DateRange } from "@/lib/types";
import { toast } from "sonner";
import { MAX_DATE_RANGE_IN_DAYS } from "@/lib/constants";

interface Props {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangeSelector({ dateRange, onDateRangeChange }: Props) {
  return (
    <DateRangePicker
      showCompare={false}
      initialDateFrom={dateRange.from}
      initialDateTo={dateRange.to}
      onUpdate={({ range }) => {
        if (!range.from || !range.to) return;

        const difference = Math.abs(differenceInDays(range.from, range.to));

        if (difference > MAX_DATE_RANGE_IN_DAYS) {
          return toast.error(
            `Date range cannot be more than ${MAX_DATE_RANGE_IN_DAYS} days.`,
          );
        }

        onDateRangeChange({ from: range.from, to: range.to });
      }}
    />
  );
}
