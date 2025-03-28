import React from "react";
import BreakdownByType from "./breakdown-by-type";
import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";

interface Props {
  data?: GetCategoriesStatsResponseType;
  isLoading: boolean;
  formattingFn: (n: number) => string;
}

export default function BreakdownsDisplay({
  data,
  isLoading,
  formattingFn,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <BreakdownByType
        type="INCOME"
        data={data?.income}
        isLoading={isLoading}
        formattingFn={formattingFn}
      />
      <BreakdownByType
        type="EXPENSE"
        data={data?.expense}
        isLoading={isLoading}
        formattingFn={formattingFn}
      />
    </div>
  );
}
