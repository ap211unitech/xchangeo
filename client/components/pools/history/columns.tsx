import { createColumnHelper } from "@tanstack/react-table";
import { ExternalLink, Eye } from "lucide-react";
import Link from "next/link";

import { Button, TokenLogo } from "@/components/ui";
import { formatTimestamp, trimString } from "@/lib/utils";
import { PoolActivity } from "@/types";

const columnHelper = createColumnHelper<PoolActivity>();

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
      return <span>{formatTimestamp(timestamp * 1000)}</span>;
    },
    footer: e => e.column.id,
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date((rowA.getValue(columnId) as PoolActivity).timestamp);
      const dateB = new Date((rowB.getValue(columnId) as PoolActivity).timestamp);
      return dateA.getTime() - dateB.getTime();
    },
  }),
  columnHelper.accessor(row => row, {
    id: "Event",
    header: () => <span>Event</span>,
    cell: info => {
      const { eventType, tokenA, tokenB } = info.getValue();
      return (
        <div className="flex items-center gap-2 text-base">
          <div className="text-muted-foreground">{eventType}</div>
          <div
            className="hover:text-primary flex items-center gap-2"
            onClick={() => window.open(`https://sepolia.etherscan.io/address/${tokenA.tokenAddress}`)}
          >
            <TokenLogo ticker={tokenA.ticker} />
            <p>{tokenA.ticker}</p>
          </div>
          {eventType === "Swap" ? <div className="text-muted-foreground">for</div> : <div className="text-muted-foreground">and</div>}
          <div
            className="hover:text-primary flex items-center gap-2"
            onClick={() => window.open(`https://sepolia.etherscan.io/address/${tokenB.tokenAddress}`)}
          >
            <TokenLogo ticker={tokenB.ticker} />
            <p>{tokenB.ticker}</p>
          </div>
        </div>
      );
    },
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "tokenA",
    header: () => <span>Token A</span>,
    cell: info => {
      const { ticker, amount } = info.getValue().tokenA;
      return (
        <div className="flex items-center gap-2">
          <div className="text-base">
            {amount} {ticker}
          </div>
          <TokenLogo ticker={ticker} />
        </div>
      );
    },
    footer: e => e.column.id,
  }),

  columnHelper.accessor(row => row, {
    id: "tokenB",
    header: () => <span>Token B</span>,
    cell: info => {
      const { ticker, amount } = info.getValue().tokenB;
      return (
        <div className="flex items-center gap-2">
          <div className="text-base">
            {amount} {ticker}
          </div>
          <TokenLogo ticker={ticker} />
        </div>
      );
    },
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "sender",
    header: () => <span>Account</span>,
    cell: info => {
      const { sender } = info.getValue();

      return (
        <Link className="hover:text-primary flex items-center gap-2" href={`https://sepolia.etherscan.io/address/${sender}`} target="_blank">
          <ExternalLink className="h-4 w-4" />
          {trimString(sender)}
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
