"use client";

import { useMemo, useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { usePoolActivity } from "@/hooks";
import { PoolInfo } from "@/types";

import { Error } from "./error";
import { Loading } from "./loading";
import { PriceChart } from "./price";

const availableChartTypes = ["Price", "Volume", "Fee"] as const;
type SelectedChartType = (typeof availableChartTypes)[number];

export const Charts = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  const [selectedChartType, setSelectedChartType] = useState<SelectedChartType>("Price");

  const { data: poolsActivity = [], isLoading, error } = usePoolActivity(poolInfo.poolAddress);

  const component = useMemo(() => {
    switch (selectedChartType) {
      case "Price":
        return <PriceChart poolInfo={poolInfo} poolsActivity={poolsActivity} />;
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
          <SelectTrigger className="bg-background !border-input w-32 rounded-full !ring-0">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent className="bg-popover/80">
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
