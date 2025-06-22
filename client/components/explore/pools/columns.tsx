import { createColumnHelper } from "@tanstack/react-table";

import { ImageComponent } from "@/components/ui";

import { LiquidityPool } from "../types";

const columnHelper = createColumnHelper<LiquidityPool>();

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
      const { tokenA, tokenB, lpAddress } = info.getValue();
      return (
        <div className="hover:text-primary flex w-fit items-center" onClick={() => window.open(`https://sepolia.etherscan.io/address/${lpAddress}`)}>
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <ImageComponent fill alt={tokenA.name} src={tokenA.icon} />
          </div>
          <div className="relative -left-2 h-8 w-8 overflow-hidden rounded-full">
            <ImageComponent fill alt={tokenB.name} src={tokenB.icon} />
          </div>
          <p className="flex items-center gap-1 text-base tracking-wide">
            {tokenA.symbol}/{tokenB.symbol}
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
      const numA = (rowA.getValue(columnId) as LiquidityPool).feeTier;
      const numB = (rowB.getValue(columnId) as LiquidityPool).feeTier;
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
            {getFormattedVolume(tokenA.volume)} {tokenA.symbol}
          </span>
          <span>/</span>
          <span>
            {getFormattedVolume(tokenB.volume)} {tokenB.symbol}
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
            {getFormattedVolume(tokenA.reserve)} {tokenA.symbol}
          </span>
          <span>/</span>
          <span>
            {getFormattedVolume(tokenB.reserve)} {tokenB.symbol}
          </span>
        </div>
      );
    },
    footer: e => e.column.id,
  }),
  columnHelper.accessor(row => row, {
    id: "userSharePercent",
    header: () => <span>Your share</span>,
    cell: info => <span>{info.getValue().userSharePercent}%</span>,
    footer: e => e.column.id,
  }),
];
