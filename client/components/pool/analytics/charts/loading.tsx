import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

const chartData = [
  { timestamp: new Date().getTime() - 300, price: 600 },
  { timestamp: new Date().getTime() - 200, price: 300 },
  { timestamp: new Date().getTime() - 100, price: 1000 },
  { timestamp: new Date().getTime(), price: 600 },
];

export const Loading = () => {
  return (
    <div className="pointer-events-none h-[350px] w-full">
      <div className="bg-secondary mb-6 h-10 w-48 rounded-md" />

      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <CartesianGrid vertical={false} strokeDasharray="1 40" stroke="gray" />
          <defs>
            <linearGradient id="loading-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="65%" stopColor="var(--secondary)" stopOpacity={0.6} />
              <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Hide ticks during loading */}
          <XAxis dataKey="timestamp" hide />
          <YAxis domain={[100, 1050]} hide />

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
