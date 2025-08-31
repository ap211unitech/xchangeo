import { createColumnHelper } from "@tanstack/react-table";
import { ExternalLink, Eye } from "lucide-react";
import Link from "next/link";

import { Button, ImageComponent } from "@/components/ui";
import { formatTimestamp, trimString } from "@/lib/utils";

import { SwapTransaction } from "../types";

const columnHelper = createColumnHelper<SwapTransaction>();

export const columns = [
  columnHelper.accessor(row => row, {
    id: "#",
    header: () => <span>#</span>,
    cell: info => <span className="text-lg font-semibold">{info.row.index + 1}</span>,
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "timestamp",
    header: () => <span>Timestamp</span>,
    cell: info => {
      const { timestamp } = info.getValue();
      return <span>{formatTimestamp(timestamp)}</span>;
    },
    footer: e => e.column.id,
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date((rowA.getValue(columnId) as SwapTransaction).timestamp);
      const dateB = new Date((rowB.getValue(columnId) as SwapTransaction).timestamp);
      return dateA.getTime() - dateB.getTime();
    },
  }),
  columnHelper.accessor(row => row, {
    id: "tokenIn",
    header: () => <span>Token In</span>,
    cell: info => {
      const { name, ticker, logo, amount } = info.getValue().tokenIn;
      return (
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <ImageComponent fill alt={name} src={logo} />
          </div>
          <div className="text-base">
            {amount} {ticker}
          </div>
        </div>
      );
    },
    footer: e => e.column.id,
    sortingFn: (rowA, rowB, columnId) => {
      const numA = (rowA.getValue(columnId) as SwapTransaction).tokenIn.ticker;
      const numB = (rowB.getValue(columnId) as SwapTransaction).tokenIn.ticker;
      return numA > numB ? 1 : -1;
    },
  }),
  columnHelper.accessor(row => row, {
    id: "tokenOut",
    header: () => <span>Token Out</span>,
    cell: info => {
      const { name, ticker, logo, amount } = info.getValue().tokenOut;
      return (
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <ImageComponent fill alt={name} src={logo} />
          </div>
          <div className="text-base">
            {amount} {ticker}
          </div>
        </div>
      );
    },
    footer: e => e.column.id,
    sortingFn: (rowA, rowB, columnId) => {
      const numA = (rowA.getValue(columnId) as SwapTransaction).tokenOut.ticker;
      const numB = (rowB.getValue(columnId) as SwapTransaction).tokenOut.ticker;
      return numA > numB ? 1 : -1;
    },
  }),
  columnHelper.accessor(row => row, {
    id: "recipient",
    header: () => <span>Account</span>,
    cell: info => {
      const { account } = info.getValue();

      return (
        <Link className="hover:text-primary flex items-center gap-2" href={`https://sepolia.etherscan.io/address/${account}`} target="_blank">
          <ExternalLink className="h-4 w-4" />
          {trimString(account)}
        </Link>
      );
    },
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: info => {
      const { transactionHash } = info.getValue();
      return (
        <div className="flex items-center gap-2 text-right">
          <Button variant="secondary" size="icon" asChild>
            <Link href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank">
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
    footer: e => e.column.id,
  }),
];
