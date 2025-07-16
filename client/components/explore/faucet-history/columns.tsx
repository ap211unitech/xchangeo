import { createColumnHelper } from "@tanstack/react-table";
import { ExternalLink, Eye } from "lucide-react";
import Link from "next/link";

import { Button, TokenLogo } from "@/components/ui";
import { formatTimestamp, trimString } from "@/lib/utils";
import { FaucetTransactionHistory } from "@/types";

const columnHelper = createColumnHelper<FaucetTransactionHistory>();

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
      const dateA = new Date((rowA.getValue(columnId) as FaucetTransactionHistory).timestamp);
      const dateB = new Date((rowB.getValue(columnId) as FaucetTransactionHistory).timestamp);
      return dateA.getTime() - dateB.getTime();
    },
  }),
  columnHelper.accessor(row => row, {
    id: "tokenInfo",
    header: () => <span>Token</span>,
    cell: info => {
      const {
        token: { name, ticker, tokenAddress },
      } = info.getValue();
      return (
        <div
          className="hover:text-primary flex items-center gap-2"
          onClick={() => window.open(`https://sepolia.etherscan.io/address/${tokenAddress}`)}
        >
          <TokenLogo ticker={ticker} />
          <div className="flex flex-col">
            <span className="text-base font-medium">{name}</span>
            <span className="text-muted-foreground">{ticker}</span>
          </div>
        </div>
      );
    },
    footer: e => e.column.id,
    sortingFn: (rowA, rowB, columnId) => {
      const numA = (rowA.getValue(columnId) as FaucetTransactionHistory).token.name;
      const numB = (rowB.getValue(columnId) as FaucetTransactionHistory).token.name;
      return numA > numB ? 1 : -1;
    },
  }),
  columnHelper.accessor(row => row, {
    id: "amount",
    header: () => <span>Amount</span>,
    cell: info => (
      <span>
        {info.getValue().amount} {info.getValue().token.ticker}
      </span>
    ),
    footer: e => e.column.id,
    sortingFn: (rowA, rowB, columnId) => {
      const numA = (rowA.getValue(columnId) as FaucetTransactionHistory).amount;
      const numB = (rowB.getValue(columnId) as FaucetTransactionHistory).amount;
      return numA > numB ? 1 : -1;
    },
  }),
  columnHelper.accessor(row => row, {
    id: "recipient",
    header: () => <span>Recipient</span>,
    cell: info => {
      const { to: recipientAddress } = info.getValue();

      return (
        <Link
          className="hover:text-primary flex items-center gap-2"
          href={`https://sepolia.etherscan.io/address/${recipientAddress}`}
          target="_blank"
        >
          <ExternalLink className="h-4 w-4" />
          {trimString(recipientAddress)}
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
