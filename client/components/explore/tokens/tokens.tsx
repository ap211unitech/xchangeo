"use client";

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { cn } from "@/lib/utils";
import availableTokens from "@/public/tokens.json";

import { columns } from "./columns";

const actionKeys = ["tokenInfo", "balance"];

export const TokensList = () => {
  const table = useReactTable({
    columns,
    data: availableTokens,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border">
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
                    className={cn("text-base", isActionTab && "cursor-pointer")}
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow key={row.id} className={cn("cursor-pointer", index % 2 && "bg-muted/50")}>
                {row.getVisibleCells().map(cell => {
                  return <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
