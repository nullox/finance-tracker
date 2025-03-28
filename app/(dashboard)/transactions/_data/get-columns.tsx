"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GetTransactionsResponseTypeRow } from "@/app/api/transactions/route";
import { DataTableColumnHeader } from "../_components/data-table-column-header";
import { cn, getCurrencyFormatter } from "@/lib/utils";
import { Currency } from "@/lib/currencies";
import { Transaction } from "@prisma/client";
import Actions from "../_components/actions";

interface Params {
  currency: Currency;
  onUpdate?: (transaction: Transaction) => void;
  onRemove?: (transaction: Transaction) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function orConditionFilter(row: any, columnId: string, filterValues: string[]) {
  if (!filterValues.length) return true;
  return filterValues.some((value) => row.getValue(columnId)?.includes(value));
}

export const getColumns = ({
  currency,
  onRemove,
}: Params): ColumnDef<GetTransactionsResponseTypeRow>[] => [
  {
    accessorKey: "categoryName",
    id: "Category",
    filterFn: orConditionFilter,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ cell }) => {
      const { categoryIcon, categoryName } = cell.row.original;
      return (
        <div className="flex gap-2 items-center">
          <span className="text-lg">{categoryIcon || "🚫"}</span>
          {categoryName || "No category"}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description;

      return <span className="text-wrap">{description}</span>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.row.original.date);
      const formattedDate = date.toLocaleString("default", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });

      return <span className="text-muted-foreground">{formattedDate}</span>;
    },
  },
  {
    accessorKey: "type",
    filterFn: orConditionFilter,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div
          className={cn(
            "p-2 rounded-full w-40 text-center",
            type === "INCOME"
              ? "text-emerald-500 bg-emerald-400/10"
              : "text-red-500 bg-red-400/10",
          )}
        >
          {type === "INCOME" ? "Income" : "Expense"}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.original.amount;

      const formatter = getCurrencyFormatter(currency);
      const formattedAmount = formatter.format(amount);

      return (
        <div className="p-2 rounded-full w-40 text-center text-foreground bg-foreground/3">
          {formattedAmount}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      
      return <Actions transaction={transaction} onRemove={onRemove} />
    }
  },
];
