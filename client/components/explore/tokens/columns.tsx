import { createColumnHelper } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button, TokenLogo } from "@/components/ui";
import { isLpToken } from "@/lib/utils";
import { TokenMetadata, TokenWithBalance } from "@/types";

const columnHelper = createColumnHelper<TokenWithBalance>();

export const columns = (walletTokens: string[], addTokenToWallet: (_token: TokenMetadata) => void, isAddingTokenToWallet: boolean) => [
  columnHelper.accessor(row => row, {
    id: "#",
    header: () => <span>#</span>,
    cell: info => <span className="text-lg font-semibold">{info.row.index + 1}</span>,
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "tokenInfo",
    header: () => <span>Token</span>,
    cell: info => {
      const { name, ticker, contractAddress } = info.getValue();
      return (
        <div
          className="hover:text-primary flex items-center gap-2"
          onClick={() => window.open(`https://sepolia.etherscan.io/address/${contractAddress}`)}
        >
          <TokenLogo id={`token-${contractAddress}`} ticker={ticker} />
          <div className="flex flex-col">
            <span className="text-base font-medium">{name}</span>
            <span className="text-muted-foreground">{ticker}</span>
          </div>
        </div>
      );
    },
    footer: e => e.column.id,
    sortingFn: (rowA, rowB, columnId) => {
      const numA = (rowA.getValue(columnId) as TokenWithBalance).name;
      const numB = (rowB.getValue(columnId) as TokenWithBalance).name;
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
      const numA = (rowA.getValue(columnId) as TokenWithBalance).balance;
      const numB = (rowB.getValue(columnId) as TokenWithBalance).balance;
      return numA > numB ? 1 : -1;
    },
  }),
  columnHelper.accessor(row => row, {
    id: "actions",
    header: () => <div>Actions</div>,
    cell: info => {
      const token = info.getValue();
      const { contractAddress } = token;

      if (isLpToken(token)) {
        return <></>;
      }

      return (
        <div className="flex items-center gap-2 text-right">
          {!!contractAddress && !walletTokens.includes(contractAddress) && (
            <Button disabled={isAddingTokenToWallet} onClick={() => addTokenToWallet(info.getValue())} variant="secondary" size="sm">
              <Plus className="size-4" /> Add to Wallet
            </Button>
          )}
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={{
                pathname: "/send",
                query: contractAddress ? { token: contractAddress } : undefined,
              }}
            >
              Send
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/explore/faucets?token=${info.getValue().contractAddress}`}>Get Tokens</Link>
          </Button>
        </div>
      );
    },
    footer: e => e.column.id,
  }),
];
