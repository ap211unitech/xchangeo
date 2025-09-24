"use client";

import { usePoolActivity } from "@/hooks";
import { PoolInfo } from "@/types";

import { Loading } from "./loading";
import { PriceChart } from "./price";

export const Charts = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  const { data: poolsActivity = [], isLoading, error } = usePoolActivity(poolInfo.poolAddress);

  if (isLoading) return <Loading />;
  if (error) return <p>Error loading data: {error.message}</p>;

  return <PriceChart poolInfo={poolInfo} poolsActivity={poolsActivity} />;
};
