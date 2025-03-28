"use client";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timeframe } from "@/lib/types";
import React, { useState } from "react";
import SelectMonth from "./select-month";
import SelectYear from "./select-year";
import HistoryGraph from "./history-graph";
import {
  useMonthHistory,
  usePeriods,
  useYearHistory,
} from "@/hooks/query-hooks";

interface Props {
  formattingFn: (n: number) => void;
}

export default function HistorySection({ formattingFn }: Props) {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const yearDataQuery = useYearHistory(
    { year },
    { enabled: timeframe === "year" },
  );
  const monthDataQuery = useMonthHistory(
    { year, month },
    { enabled: timeframe === "month" },
  );
  const periodsQuery = usePeriods();

  const isDataLoading =
    timeframe === "month" ? monthDataQuery.isLoading : yearDataQuery.isLoading;

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">History</h2>
      <Card>
        <CardContent className="flex flex-col gap-6 min-h-[300px]">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
              <Tabs
                value={timeframe}
                onValueChange={(value) => setTimeframe(value as Timeframe)}
              >
                <TabsList className="w-32">
                  <TabsTrigger value="year">Year</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                <SkeletonWrapper isLoading={periodsQuery.isLoading}>
                  <SelectYear
                    values={periodsQuery.data || []}
                    year={year}
                    onYearChange={setYear}
                  />
                </SkeletonWrapper>
                {timeframe === "month" && (
                  <SkeletonWrapper isLoading={periodsQuery.isLoading}>
                    <SelectMonth month={month} onMonthChange={setMonth} />
                  </SkeletonWrapper>
                )}
              </div>
            </div>
            <div className="gap-2 hidden md:flex">
              <Badge
                variant="outline"
                className="p-2 font-bold text-sm rounded-full"
              >
                <div className="size-4 bg-emerald-400 rounded-full mr-1"></div>{" "}
                Income
              </Badge>
              <Badge
                variant="outline"
                className="p-2 font-bold text-sm rounded-full"
              >
                <div className="size-4 bg-red-400 rounded-full mr-1"></div>{" "}
                Expense
              </Badge>
            </div>
          </div>

          <SkeletonWrapper isLoading={isDataLoading} className="flex-1">
            <HistoryGraph
              yearData={yearDataQuery.data || []}
              monthData={monthDataQuery.data || []}
              timeframe={timeframe}
              formattingFn={formattingFn}
            />
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
