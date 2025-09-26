"use client";

import { useMemo, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { usePoolActivity } from "@/hooks";
import { PoolInfo } from "@/types";

import { CumulativeFeesChart } from "./cumulativeFees";
import { Error } from "./error";
import { LiquidityChart } from "./liquidity";
import { Loading } from "./loading";
import { PriceChart } from "./price";

const availableChartTypes = ["Price", "Liquidity", "Cumulative Fees"] as const;
type SelectedChartType = (typeof availableChartTypes)[number];

export const Charts = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  const [selectedChartType, setSelectedChartType] = useState<SelectedChartType>("Price");

  // Latest item at first position
  const { data: poolsActivity = [], isLoading, error } = usePoolActivity(poolInfo.poolAddress);

  const component = useMemo(() => {
    switch (selectedChartType) {
      case "Price":
        return <PriceChart poolInfo={poolInfo} poolsActivity={poolsActivity} />;
      case "Liquidity":
        return <LiquidityChart poolInfo={poolInfo} poolsActivity={poolsActivity} />;
      case "Cumulative Fees":
        return <CumulativeFeesChart poolInfo={poolInfo} poolsActivity={poolsActivity} />;
      default:
        return null;
    }
  }, [poolInfo, poolsActivity, selectedChartType]);

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <>
      {component}
      <div className="flex justify-end">
        <Select value={selectedChartType} onValueChange={e => setSelectedChartType(e as SelectedChartType)}>
          <SelectTrigger className="bg-background !border-input max-w-full rounded-full !ring-0">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent align="center" className="rounded-xl">
            {availableChartTypes.map(chartType => (
              <SelectItem key={chartType} value={chartType}>
                {chartType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
