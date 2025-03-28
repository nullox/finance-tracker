"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Download } from "lucide-react";
import { download, generateCsv, mkConfig } from "export-to-csv";
import {
  GetTransactionsResponseType,
  GetTransactionsResponseTypeRow,
} from "@/app/api/transactions/route";

interface DataTableProps {
  columns: ColumnDef<GetTransactionsResponseTypeRow>[];
  data: GetTransactionsResponseType;
  categoryOptions: { label: string; value: string }[];
}

const csvConfig = mkConfig({
  columnHeaders: ["category", "description", "date", "type", "amount"],
  filename: "Transactions",
});

export function TransactionsDataTable({
  columns,
  data,
  categoryOptions,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const exportCSV = useCallback(() => {
    if (!data) return;

    const preprocessedData = data.map((entry) => ({
      category: entry.categoryId
        ? `${entry.categoryIcon} ${entry.categoryName}`
        : "",
      description: entry.description,
      date: entry.date,
      type: entry.type,
      amount: entry.amount,
    }));

    const csv = generateCsv(csvConfig)(preprocessedData);
    download(csvConfig)(csv);
  }, [data]);

  const typeOptions = [
    { label: "Income", value: "INCOME" },
    { label: "Expense", value: "EXPENSE" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col-reverse sm:flex-row gap-4 justify-between">
        <div className="space-x-2">
          <DataTableFacetedFilter
            options={categoryOptions}
            title="Category"
            column={table.getColumn("Category")}
          />
          <DataTableFacetedFilter
            options={typeOptions}
            title="Type"
            column={table.getColumn("type")}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={exportCSV}>
            <Download /> Export CSV
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
