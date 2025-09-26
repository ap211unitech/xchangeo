import moment from "moment";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PoolActivity, PoolInfo } from "@/types";

import { NoData } from "../noData";

type Props = {
  poolInfo: PoolInfo;
  poolsActivity: PoolActivity[];
};

const formatFee = (price: number, maximumFractionDigits?: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "standard",
    maximumFractionDigits: maximumFractionDigits ?? 6,
  }).format(price);
};

type ChartHoverData = {
  timestamp: number;
  totalFeesA: number;
  totalFeesB: number;
};

export const CumulativeFeesChart = ({ poolsActivity, poolInfo }: Props) => {
  const [hoverData, setHoverData] = useState<ChartHoverData | null>(null);

  const chartData = useMemo(() => {
    if (!poolsActivity) return [];

    let cumulativeFeesA = 0;
    let cumulativeFeesB = 0;

    return poolsActivity
      .toReversed()
      .map(tx => {
        cumulativeFeesA += tx.feesA;
        cumulativeFeesB += tx.feesB;

        return {
          timestamp: tx.timestamp * 1000,
          totalFeesA: cumulativeFeesA,
          totalFeesB: cumulativeFeesB,
        };
      })
      .filter(({ totalFeesA, totalFeesB }) => !(totalFeesA === 0 && totalFeesB === 0))
      .slice(-30); // show only latest 30 cumulative fees
  }, [poolsActivity]);

  const latestPriceData = useMemo(() => chartData.at(chartData.length - 1), [chartData]);
  const displayData = hoverData || latestPriceData;

  if (!chartData || chartData.length === 0) return <NoData />;

  return (
    <div className="w-full">
      {/* Dynamic Header */}
      <div className="mb-6 flex h-14 flex-col items-start gap-1">
        <div className="flex items-center gap-3">
          <p className="text-xl md:text-2xl">
            {formatFee(displayData?.totalFeesA || 0)} {poolInfo.tokenA.ticker}
          </p>
          <p className="bg-muted-foreground h-6 w-0.5"></p>
          <p className="text-xl md:text-2xl">
            {formatFee(displayData?.totalFeesB || 0)} {poolInfo.tokenB.ticker}
          </p>
        </div>
        <p className="text-muted-foreground text-sm">
          Untill {displayData ? moment(displayData.timestamp).format("MMM DD, YYYY, h:mm:ss A") : "..."}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onMouseMove={e => e.activeIndex && setHoverData(chartData[+e.activeIndex])}
          onMouseLeave={() => setHoverData(null)}
        >
          <CartesianGrid vertical={false} strokeDasharray="1 40" stroke="var(--muted-foreground)" />

          <XAxis
            dataKey="timestamp"
            axisLine={false}
            tickLine={false}
            tickFormatter={time => moment(new Date(time)).format("MMM DD")}
            stroke="var(--muted-foreground)"
            fontSize={12}
            domain={["dataMin", "dataMax"]}
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

          <Tooltip cursor={{ stroke: "var(--muted-foreground)", fill: "var(--muted)", strokeWidth: 1 }} content={() => null} />
          <Legend verticalAlign="top" align="left" wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }} />

          <Bar
            stackId="1"
            dataKey="totalFeesA"
            fill="var(--chart-4)"
            className="opacity-90"
            isAnimationActive={false}
            name={`Cumulative ${poolInfo.tokenA.ticker} Fees`}
          />
          <Bar
            stackId="1"
            dataKey="totalFeesB"
            fill="var(--chart-2)"
            className="opacity-90"
            isAnimationActive={false}
            name={`Cumulative ${poolInfo.tokenB.ticker} Fees`}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
