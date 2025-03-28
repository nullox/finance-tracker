"use client";

import React, { useState } from "react";
import { startOfMonth } from "date-fns";
import { DateRange } from "@/lib/types";
import { dateToYMD } from "@/lib/utils";
import { DateRangeSelector } from "./date-range-selector";
import { StatsDisplay } from "./stats-display";
import BreakdownDisplay from "./breakdown-display";
import { useCashFlow, useCategoriesStats } from "@/hooks/query-hooks";

interface Props {
  formattingFn: (n: number) => string;
}

export default function OverviewSection({ formattingFn }: Props) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const YMDDateRange = {
    from: dateToYMD(dateRange.from),
    to: dateToYMD(dateRange.to),
  };

  const cashFlowQuery = useCashFlow(YMDDateRange);
  const categoriesStatsQuery = useCategoriesStats(YMDDateRange);

  const isLoading = cashFlowQuery.isPending;
  const { income, expense, balance } = cashFlowQuery.data || {};

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 items-start justify-between w-full">
        <h2 className="text-3xl font-bold">Overview</h2>
        <DateRangeSelector
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
      <div className="space-y-4 md:space-y-2">
        <StatsDisplay
          isLoading={isLoading}
          income={income}
          expense={expense}
          balance={balance}
          formattingFn={formattingFn}
        />
        <BreakdownDisplay
          data={categoriesStatsQuery.data}
          isLoading={categoriesStatsQuery.isLoading}
          formattingFn={formattingFn}
        />
      </div>
    </div>
  );
}
