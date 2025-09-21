import BN from "bignumber.js";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { getHumanizeValue } from "@/lib/utils";
import { PoolInfo } from "@/types";

export const Stats = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  const tickerA = poolInfo.tokenA.ticker;
  const tickerB = poolInfo.tokenB.ticker;

  return (
    <Card className="dark:bg-card bg-secondary/60 gap-4 border-none">
      <CardHeader>
        <CardTitle className="text-xl font-medium tracking-wide md:text-2xl">Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-muted-foreground text-base leading-10">Pool reserves</p>
          <SplitBar tickerA={tickerA} tickerB={tickerB} valueA={new BN(poolInfo.tokenA.reserve)} valueB={new BN(poolInfo.tokenB.reserve)} />
        </div>
        <div>
          <p className="text-muted-foreground text-base leading-10">All-time volume</p>
          <SplitBar
            tickerA={tickerA}
            tickerB={tickerB}
            valueA={new BN(poolInfo.tokenA.allTimeVolume)}
            valueB={new BN(poolInfo.tokenB.allTimeVolume)}
          />
        </div>
        <div>
          <p className="text-muted-foreground text-base leading-10">All-time fees</p>
          <SplitBar tickerA={tickerA} tickerB={tickerB} valueA={new BN(poolInfo.tokenA.allTimeFee)} valueB={new BN(poolInfo.tokenB.allTimeFee)} />
        </div>
        <div>
          <p className="text-muted-foreground text-base leading-10">Fee tier</p>
          <p className="text-2xl md:text-3xl">{poolInfo.feeTier / 100}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

type SplitBarProps = {
  valueA: BN;
  valueB: BN;
  tickerA: string;
  tickerB: string;
};

const SplitBar = ({ valueA, valueB, tickerA, tickerB }: SplitBarProps) => {
  const totalValue = valueA.plus(valueB);
  const valueAPercentage = totalValue.eq(new BN(0)) ? new BN(50) : valueA.multipliedBy(100).dividedBy(totalValue).toNumber();
  const valueBPercentage = totalValue.eq(new BN(0)) ? new BN(50) : valueB.multipliedBy(100).dividedBy(totalValue).toNumber();

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <p className="text-lg md:text-xl">
          {getHumanizeValue(valueA.toNumber())} {tickerA}
        </p>
        <p className="text-lg md:text-xl">
          {getHumanizeValue(valueB.toNumber())} {tickerB}
        </p>
      </div>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
        <div className="bg-chart-2 h-full" style={{ width: `${valueAPercentage}%` }} />
        <div className="bg-chart-4 h-full" style={{ width: `${valueBPercentage}%` }} />
      </div>
    </div>
  );
};
