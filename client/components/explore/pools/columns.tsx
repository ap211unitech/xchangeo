import { createColumnHelper } from "@tanstack/react-table";

import { TokenLogo } from "@/components/ui";
import { PoolInfo } from "@/types";

const columnHelper = createColumnHelper<PoolInfo>();

const getFormattedVolume = (volume: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact", // gives 1.2K, 1.5M etc.
    maximumFractionDigits: 1,
  }).format(volume);

export const columns = [
  columnHelper.accessor(row => row, {
    id: "#",
    header: () => <span>#</span>,
    cell: info => <span className="text-lg font-semibold">{info.row.index + 1}</span>,
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "pool",
    header: () => <span>Pool</span>,
    cell: info => {
      const { poolAddress, tokenA, tokenB } = info.getValue();
      return (
        <div
          className="hover:text-primary flex w-fit items-center"
          onClick={() => window.open(`https://sepolia.etherscan.io/address/${poolAddress}`)}
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <TokenLogo ticker={tokenA.ticker} />
          </div>

          <div className="relative -left-2 h-8 w-8 overflow-hidden rounded-full">
            <TokenLogo ticker={tokenB.ticker} />
          </div>
          <p className="flex items-center gap-1 text-base tracking-wide">
            {tokenA.ticker}/{tokenB.ticker}
          </p>
        </div>
      );
    },
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "feeTier",
    header: () => <span>Fee tier</span>,
    cell: info => <span>{info.getValue().feeTier / 100}%</span>,
    footer: e => e.column.id,
    sortingFn: (rowA, rowB, columnId) => {
      const numA = (rowA.getValue(columnId) as PoolInfo).feeTier;
      const numB = (rowB.getValue(columnId) as PoolInfo).feeTier;
      return numA > numB ? 1 : -1;
    },
  }),
  columnHelper.accessor(row => row, {
    id: "allTimeVolume",
    header: () => <span>All-Time Volume</span>,
    cell: info => {
      const { tokenA, tokenB } = info.getValue();
      return (
        <div className="flex items-center gap-1">
          <span>
            {getFormattedVolume(tokenA.allTimeVolume)} {tokenA.ticker}
          </span>
          <span>/</span>
          <span>
            {getFormattedVolume(tokenB.allTimeVolume)} {tokenB.ticker}
          </span>
        </div>
      );
    },
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "poolReserves",
    header: () => <span>Pool Reserves</span>,
    cell: info => {
      const { tokenA, tokenB } = info.getValue();
      return (
        <div className="flex items-center gap-1">
          <span>
            {getFormattedVolume(tokenA.reserve)} {tokenA.ticker}
          </span>
          <span>/</span>
          <span>
            {getFormattedVolume(tokenB.reserve)} {tokenB.ticker}
          </span>
        </div>
      );
    },
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "userSharePercent",
    header: () => <span>Your share</span>,
    cell: info => <span>{info.getValue().userSharePercent ?? 0}%</span>,
    footer: e => e.column.id,
  }),
];
