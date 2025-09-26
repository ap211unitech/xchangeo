import moment from "moment";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PoolActivity, PoolInfo } from "@/types";

import { NoData } from "../noData";

type Props = {
  poolInfo: PoolInfo;
  poolsActivity: PoolActivity[];
};

type ChartHoverData = {
  timestamp: number;
  reserveA: number;
  reserveB: number;
};

const formatReserve = (price: number, maximumFractionDigits?: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "standard",
    maximumFractionDigits: maximumFractionDigits ?? 4,
  }).format(price);
};

export const LiquidityChart = ({ poolsActivity, poolInfo }: Props) => {
  const [hoverData, setHoverData] = useState<ChartHoverData | null>(null);

  const chartData = useMemo(() => {
    if (!poolsActivity) return [];

    return poolsActivity.map(tx => ({
      timestamp: tx.timestamp * 1000,
      reserveA: tx.reserveA,
      reserveB: tx.reserveB,
    }));
  }, [poolsActivity]);

  const latestPriceData = useMemo(() => chartData.at(0), [chartData]);
  const displayData = hoverData || latestPriceData;

  if (!chartData || chartData.length === 0) return <NoData />;

  return (
    <div className="w-full">
      {/* Dynamic Header */}
      <div className="mb-6 flex h-14 flex-col items-start gap-1">
        <div className="flex items-center gap-3">
          <p className="text-xl md:text-2xl">
            {formatReserve(displayData?.reserveA || 0)} {poolInfo.tokenA.ticker}
          </p>
          <p className="bg-muted-foreground h-6 w-0.5"></p>
          <p className="text-xl md:text-2xl">
            {formatReserve(displayData?.reserveB || 0)} {poolInfo.tokenB.ticker}
          </p>
        </div>
        <p className="text-muted-foreground text-sm">{displayData ? moment(displayData.timestamp).format("MMM DD, YYYY, h:mm:ss A") : "..."}</p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={chartData}
          onMouseMove={e => e.activeIndex && setHoverData(chartData[+e.activeIndex])}
          onMouseLeave={() => setHoverData(null)}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="1 40" stroke="var(--muted-foreground)" />

          <defs>
            <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="timestamp"
            type="number"
            domain={["dataMin", "dataMax"]}
            axisLine={false}
            tickLine={false}
            tickFormatter={time => moment(new Date(time)).format("MMM DD, HH:mmA")}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickMargin={10}
          />
          <YAxis
            orientation="right"
            axisLine={false}
            tickLine={false}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickFormatter={value => value.toLocaleString()}
          />

          <Tooltip cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "3 3" }} content={() => null} />
          <Legend verticalAlign="top" align="left" wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }} />

          <Area
            stackId="1"
            type="stepBefore"
            dataKey="reserveB"
            name={poolInfo.tokenB.ticker}
            stroke="var(--chart-4)"
            strokeWidth={2}
            fill="url(#colorB)"
            activeDot={{ r: 4, stroke: "var(--primary-foreground)", strokeWidth: 2, fill: "var(--chart-4)" }}
            dot={false}
            isAnimationActive={false}
          />
          <Area
            stackId="1"
            type="stepBefore"
            dataKey="reserveA"
            name={poolInfo.tokenA.ticker}
            stroke="var(--chart-2)"
            strokeWidth={2}
            fill="url(#colorA)"
            activeDot={{ r: 4, stroke: "var(--primary-foreground)", strokeWidth: 2, fill: "var(--chart-2)" }}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
