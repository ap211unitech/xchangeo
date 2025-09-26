import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui";
import { PoolActivity, PoolInfo } from "@/types";

import { NoData } from "../noData";

type Props = {
  poolInfo: PoolInfo;
  poolsActivity: PoolActivity[];
};

type ChartHoverData = {
  timestamp: number;
  price: number;
};

const formatPrice = (price: number, maximumFractionDigits?: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "standard",
    maximumFractionDigits: maximumFractionDigits ?? 10,
  }).format(price);
};

export const PriceChart = ({ poolInfo, poolsActivity }: Props) => {
  const [hoverData, setHoverData] = useState<ChartHoverData | null>(null);
  const [invertPrice, setInvertPrice] = useState(false);

  const chartData = useMemo(() => {
    if (!poolsActivity) return [];

    return poolsActivity.map(tx => {
      const reserveA = tx.reserveA;
      const reserveB = tx.reserveB;

      const price = invertPrice
        ? reserveB > 0
          ? reserveA / reserveB
          : 0 // Price of TokenB in terms of TokenA
        : reserveA > 0
          ? reserveB / reserveA
          : 0; // Price of TokenA in terms of TokenB

      return {
        timestamp: tx.timestamp * 1000,
        price,
      };
    });
  }, [invertPrice, poolsActivity]);

  const yAxisDomain = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return ["auto", "auto"]; // Fallback for no data
    }

    const prices = chartData.map(d => d.price);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    let padding = (maxPrice - minPrice) * 0.8;
    const paddedMin = Math.max(0, minPrice - padding); // Ensure min doesn't go below 0

    padding = (maxPrice - minPrice) * 0.2;
    const paddedMax = maxPrice + padding;

    return [paddedMin, paddedMax];
  }, [chartData]);

  const latestPriceData = useMemo(() => chartData.at(0), [chartData]);
  const displayData = hoverData || latestPriceData;

  const mainPrice = displayData ? displayData.price : 0;

  const baseTicker = invertPrice ? poolInfo.tokenA.ticker : poolInfo.tokenB.ticker;
  const quoteTicker = invertPrice ? poolInfo.tokenB.ticker : poolInfo.tokenA.ticker;

  if (!chartData || chartData.length === 0) return <NoData />;

  return (
    <div className="w-full">
      {/* Dynamic Header */}
      <div className="mb-6 flex h-14 flex-col items-start gap-1">
        <div className="flex items-center gap-3">
          <p className="text-xl font-medium md:text-2xl">1 {quoteTicker} =</p>
          <p className="text-xl font-medium md:text-2xl">
            {formatPrice(mainPrice)} {baseTicker}
          </p>
          <Button size="sm" variant="secondary" onClick={() => setInvertPrice(!invertPrice)} title="Invert price">
            <ArrowUpDown className="size-4" />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">{displayData ? moment(displayData.timestamp).format("MMM DD, YYYY, h:mm:ss A") : "..."}</p>
      </div>

      {/* The Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={chartData}
          onMouseMove={e => e.activeIndex && setHoverData(chartData[+e.activeIndex])}
          onMouseLeave={() => setHoverData(null)}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="1 40" stroke="var(--muted-foreground)" />

          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="25%" stopColor="var(--primary)" stopOpacity={0.15} />
              <stop offset="65%" stopColor="var(--primary)" stopOpacity={0.1} />
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
            dataKey="price"
            type="number"
            domain={yAxisDomain}
            axisLine={false}
            tickLine={false}
            tickFormatter={price => formatPrice(price, 6)}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickMargin={10}
          />
          <Tooltip cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "3 3" }} content={() => null} />
          <Legend verticalAlign="top" align="left" wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }} />
          <Area
            name="Price"
            type="monotone"
            dataKey="price"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#chart-gradient)"
            activeDot={{ r: 4, stroke: "var(--primary-foreground)", strokeWidth: 2, fill: "var(--primary)" }}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
