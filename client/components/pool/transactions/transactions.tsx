"use client";

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { usePoolActivity } from "@/hooks";
import { cn } from "@/lib/utils";

import { columns } from "./columns";
import { Loading } from "./loading";

const actionKeys = ["timestamp"];

export const Transactions = ({ poolAddress }: { poolAddress: string }) => {
  const { data: poolsActivity = [], isLoading } = usePoolActivity(poolAddress);

  const table = useReactTable({
    columns,
    data: poolsActivity,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="max-h-[40rem] overflow-x-hidden overflow-y-auto rounded-xl border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="!bg-muted">
              {headerGroup.headers.map(header => {
                const getSorted = header.column.getIsSorted();
                const isActionTab = actionKeys.includes(header.id);

                const handleSort = (): void => {
                  const isDesc = getSorted === "desc";
                  header.column.toggleSorting(!isDesc);
                };

                return (
                  <TableHead
                    className={cn("px-4 text-base", isActionTab && "cursor-pointer")}
                    {...(isActionTab && { onClick: handleSort })}
                    key={header.id}
                  >
                    <>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {isActionTab && <ChevronsUpDown className="text-primary ml-2 inline-block h-3 w-3 align-middle" />}
                    </>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-40 space-y-2 text-center">
                <Loading />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow key={row.id} className={cn("h-18 cursor-pointer", index % 2 && "bg-muted/50")}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <TableCell className="px-4" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-40 space-y-2 text-center">
                No activity yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
