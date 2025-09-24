import moment from "moment";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

const chartData = [
  { timestamp: new Date().getTime() - 300, price: 600 },
  { timestamp: new Date().getTime() - 200, price: 300 },
  { timestamp: new Date().getTime() - 100, price: 1000 },
  { timestamp: new Date().getTime(), price: 600 },
];

export const Loading = () => {
  return (
    <div className="pointer-events-none w-full">
      <div className="mb-6 grid max-w-fit place-items-start gap-2">
        <div className="bg-secondary h-8 w-48 rounded-md" />
        <div className="bg-secondary h-4 w-28 rounded-sm" />
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData}>
          <CartesianGrid vertical={false} strokeDasharray="1 40" stroke="gray" />
          <defs>
            <linearGradient id="loading-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="65%" stopColor="var(--secondary)" stopOpacity={0.6} />
              <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.3} />
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
            domain={[180, 1100]}
            axisLine={false}
            tickLine={false}
            tickFormatter={price => price}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickMargin={10}
          />

          <Area
            type="natural"
            dataKey="price"
            stroke="var(--secondary)"
            strokeWidth={3}
            fill="url(#loading-gradient)"
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
