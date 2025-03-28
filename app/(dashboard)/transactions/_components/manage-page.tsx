"use client";

import { useSettings, useTransactions } from "@/hooks/query-hooks";
import { TransactionsDataTable } from "./transactions-date-table";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { getColumns } from "../_data/get-columns";
import { GetTransactionsResponseType } from "@/app/api/transactions/route";
import { useMemo, useState } from "react";
import { currencies, FALLBACK_CURRENCY } from "@/lib/currencies";
import { DateRangeSelector } from "../../dashboard/_components/date-range-selector";
import { DateRange } from "@/lib/types";
import { startOfMonth } from "date-fns";
import { dateToYMD } from "@/lib/utils";
import {
  useDeleteTransaction,
  useUpdateTransaction,
} from "@/hooks/mutation-hooks";

const emptyData: GetTransactionsResponseType = [];

export default function ManagePage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const transactionsQuery = useTransactions({
    from: dateToYMD(dateRange.from),
    to: dateToYMD(dateRange.to),
  });
  const settingsQuery = useSettings();

  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const isLoading = transactionsQuery.isLoading || settingsQuery.isLoading;

  const columns = useMemo(() => {
    const currencyValue = settingsQuery.data?.currency;
    const currency = currencies.find(
      (currency) => currency.value === currencyValue,
    );

    return getColumns({
      currency: currency || FALLBACK_CURRENCY,
      onUpdate: updateTransaction.mutate,
      onRemove: deleteTransaction.mutate,
    });
  }, [settingsQuery.data, deleteTransaction, updateTransaction]);

  const categoryOptions = useMemo(() => {
    const categories = transactionsQuery.data
      ?.filter(({ categoryName }) => categoryName)
      .map(
        ({ categoryIcon, categoryName }) => `${categoryIcon} ${categoryName}`,
      );

    const uniqueCategories = Array.from(new Set(categories));

    return uniqueCategories.map((category) => ({
      label: category,
      value: category.split(" ")[1],
    }));
  }, [transactionsQuery.data]);

  return (
    <div>
      <div className="bg-card border-b">
        <div className="mx-auto max-w-7xl py-6 px-6 flex flex-col sm:flex-row space-y-2 justify-between">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <DateRangeSelector
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-6 sm:px-6">
        <SkeletonWrapper isLoading={isLoading}>
          <TransactionsDataTable
            data={transactionsQuery.data || emptyData}
            columns={columns}
            categoryOptions={categoryOptions}
          />
        </SkeletonWrapper>
      </div>
    </div>
  );
}
