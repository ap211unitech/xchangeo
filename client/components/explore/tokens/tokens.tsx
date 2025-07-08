"use client";

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";

import { ConnectWalletOverlay, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useBalances } from "@/hooks";
import { cn } from "@/lib/utils";
import { TokenMetadata } from "@/services/types";

import { columns } from "./columns";
import { Loading } from "./loading";

const actionKeys = ["tokenInfo", "balance"];

type Props = { tokens: TokenMetadata[] };

export const TokensList = ({ tokens }: Props) => {
  const { data: tokensWithBalances = [], isPending } = useBalances(tokens);

  const table = useReactTable({
    columns,
    data: tokensWithBalances,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <ConnectWalletOverlay>
      <div className="overflow-hidden rounded-xl border">
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
            {isPending ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 space-y-2 text-center">
                  <Loading />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id} className={cn("cursor-pointer", index % 2 && "bg-muted/50")}>
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
                  No tokens found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </ConnectWalletOverlay>
  );
};
