"use client";

import React, { useMemo } from "react";
import OverviewSection from "./_components/overview-section";
import HistorySection from "./_components/history-section";
import { currencies } from "@/lib/currencies";
import { getCurrencyFormatter } from "@/lib/utils";
import { useSettings } from "@/hooks/query-hooks";

export default function Sections() {
  const { data } = useSettings();

  const formatter = useMemo(() => {
    const value = data?.currency;
    const currency = currencies.find((currency) => currency.value === value);
    return getCurrencyFormatter(currency);
  }, [data]);

  return (
    <div className="mt-8 flex flex-col gap-12 mx-auto max-w-7xl px-2 sm:px-6">
      <OverviewSection formattingFn={formatter.format} />
      <HistorySection formattingFn={formatter.format} />
    </div>
  );
}
