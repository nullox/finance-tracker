import { GetCategoriesResponseType } from "@/app/api/categories/route";
import { GetMonthHistoryResponseType } from "@/app/api/history/month/route";
import { GetPeriodsResponseType } from "@/app/api/history/periods/route";
import { GetYearDataResponseType } from "@/app/api/history/year/route";
import { GetSettingsResponseType } from "@/app/api/settings/route";
import { GetBalanceResponseType } from "@/app/api/stats/cash-flow/route";
import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import { GetTransactionsResponseType } from "@/app/api/transactions/route";
import { TransactionType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface CreateHookParams<P> {
  queryKey: any[] | ((params: P) => any[]);
  url: string | ((params: P) => string);
}

type Options = {
  enabled?: boolean;
};

// Helper function
async function fetchData(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
}

// Generic hook generator
function createHook<T, P>({
  queryKey: getQueryKey,
  url: getUrl,
}: CreateHookParams<P>) {
  return (params: P = <P>{}, options: Options = {}) => {
    const queryKey =
      typeof getQueryKey === "function" ? getQueryKey(params) : getQueryKey;
    const queryFn = () =>
      fetchData(typeof getUrl === "function" ? getUrl(params) : getUrl);

    return useQuery<T>({ queryKey, queryFn, ...options });
  };
}

// Hooks
export const useCategories = createHook<
  GetCategoriesResponseType,
  { type?: TransactionType }
>({
  queryKey: ({ type }) => ["categories", type || "all"],
  url: ({ type }) =>
    type ? `/api/categories?type=${type}` : "/api/categories",
});

export const useYearHistory = createHook<
  GetYearDataResponseType,
  { year: number }
>({
  queryKey: ({ year }) => ["transactions", "year-history", year],
  url: ({ year }) => `/api/history/year?year=${year}`,
});

export const useMonthHistory = createHook<
  GetMonthHistoryResponseType,
  { year: number; month: number }
>({
  queryKey: ({ year, month }) => ["transactions", "month-history", year, month],
  url: ({ year, month }) => `/api/history/month?year=${year}&month=${month}`,
});

export const usePeriods = createHook<GetPeriodsResponseType, void>({
  queryKey: ["transactions", "periods"],
  url: "/api/history/periods",
});

export const useSettings = createHook<GetSettingsResponseType, void>({
  queryKey: ["settings"],
  url: "/api/settings",
});

export const useCashFlow = createHook<
  GetBalanceResponseType,
  { from: string; to: string }
>({
  queryKey: ({ from, to }) => ["transactions", "cash-flow", from, to],
  url: ({ from, to }) => `/api/stats/cash-flow?from=${from}&to=${to}`,
});

export const useCategoriesStats = createHook<
  GetCategoriesStatsResponseType,
  { from: string; to: string }
>({
  queryKey: ({ from, to }) => ["transactions", "categories-stats", from, to],
  url: ({ from, to }) => `/api/stats/categories?from=${from}&to=${to}`,
});

export const useTransactions = createHook<
  GetTransactionsResponseType,
  { from: string; to: string }
>({
  queryKey: ({ from, to }) => ["transactions", from, to],
  url: ({ from, to }) => `/api/transactions?from=${from}&to=${to}`,
});
