import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

import { Button, ImageComponent } from "@/components/ui";

type Token = {
  name: string;
  ticker: string;
  contractAddress: string;
  logo: string;
  balance: number;
};

const columnHelper = createColumnHelper<Token>();

export const columns = [
  columnHelper.accessor(row => row, {
    id: "#",
    header: () => <span>#</span>,
    cell: info => <span className="text-lg font-semibold">{info.row.index + 1}</span>,
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "tokenInfo",
    header: () => <span>Token Info</span>,
    cell: info => {
      const { name, ticker, logo } = info.getValue();
      return (
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <ImageComponent fill alt={name} src={logo} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-medium">{name}</span>
            <span className="text-muted-foreground">{ticker}</span>
          </div>
        </div>
      );
    },
    footer: e => e.column.id,
    sortingFn: (rowA, rowB, columnId) => {
      const numA = (rowA.getValue(columnId) as Token).ticker;
      const numB = (rowB.getValue(columnId) as Token).ticker;
      return numA > numB ? 1 : -1;
    },
  }),
  columnHelper.accessor(row => row, {
    id: "balance",
    header: () => <span>Balance</span>,
    cell: info => (
      <span>
        {info.getValue().balance} {info.getValue().ticker}
      </span>
    ),
    footer: e => e.column.id,
    sortingFn: (rowA, rowB, columnId) => {
      const numA = (rowA.getValue(columnId) as Token).balance;
      const numB = (rowB.getValue(columnId) as Token).balance;
      return numA > numB ? 1 : -1;
    },
  }),
  columnHelper.accessor(row => row, {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: () => (
      <div className="flex items-center gap-2 text-right">
        <Button variant="secondary" size="sm">
          Add to Wallet
        </Button>
        <Button size="sm" asChild>
          <Link href="/explore/faucets">Get Tokens</Link>
        </Button>
      </div>
    ),
    footer: e => e.column.id,
  }),
];
