import { createColumnHelper } from "@tanstack/react-table";
import { EyeIcon, Plus } from "lucide-react";
import Link from "next/link";

import { Button, TokenLogo } from "@/components/ui";
import { getHumanizeValue } from "@/lib/utils";
import { PoolInfo, UserShare } from "@/types";

const columnHelper = createColumnHelper<PoolInfo>();

const getFormattedVolume = (volume: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact", // gives 1.2K, 1.5M etc.
    maximumFractionDigits: 1,
    roundingMode: "trunc",
  }).format(volume);

export const columns = (userShares: UserShare[]) =>
  [
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
          <div className="hover:text-primary flex w-fit items-center" onClick={() => window.open(`/pool/${poolAddress}`)}>
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
          <div className="flex flex-col gap-2 justify-self-start">
            <span className="text-base font-semibold">
              {getFormattedVolume(tokenA.allTimeVolume)} {tokenA.ticker} /
            </span>
            <span className="text-muted-foreground">
              {getFormattedVolume(tokenB.allTimeVolume)} {tokenB.ticker}
            </span>
          </div>
        );
      },
      footer: e => e.column.id,
    }),
    columnHelper.accessor(row => row, {
      id: "allTimeFee",
      header: () => <span>All-Time Fee</span>,
      cell: info => {
        const { tokenA, tokenB } = info.getValue();
        return (
          <div className="flex flex-col gap-2 justify-self-start">
            <span className="text-base font-semibold">
              {getHumanizeValue(tokenA.allTimeFee, 6)} {tokenA.ticker} /
            </span>
            <span className="text-muted-foreground">
              {getHumanizeValue(tokenB.allTimeFee, 6)} {tokenB.ticker}
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
          <div className="flex flex-col gap-2 justify-self-start">
            <span className="text-base font-semibold">
              {getFormattedVolume(tokenA.reserve)} {tokenA.ticker} /
            </span>
            <span className="text-muted-foreground">
              {getFormattedVolume(tokenB.reserve)} {tokenB.ticker}
            </span>
          </div>
        );
      },
      footer: e => e.column.id,
    }),
    userShares.length > 0 &&
      columnHelper.accessor(row => row, {
        id: "userSharePercent",
        header: () => <span>Your share</span>,
        cell: info => (
          <span>
            {new Intl.NumberFormat("en-US", {
              notation: "standard",
              maximumFractionDigits: 2,
            }).format(userShares.find(({ poolAddress }) => poolAddress === info.getValue().poolAddress)?.userShare ?? 0)}
            %
          </span>
        ),
        footer: e => e.column.id,
      }),
    columnHelper.accessor(row => row, {
      id: "actions",
      header: () => <div>Actions</div>,
      cell: info => {
        const poolAddress = info.getValue().poolAddress;

        return (
          <div className="flex items-center gap-2 text-right">
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/pool/${poolAddress}`}>
                <EyeIcon className="size-4" /> View Pool
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link
                href={{
                  pathname: "/pools/addLiquidity",
                  query: { pool: poolAddress },
                }}
              >
                <Plus className="size-4" /> Add Liquidity
              </Link>
            </Button>
          </div>
        );
      },
      footer: e => e.column.id,
    }),
  ].filter(e => !!e);
