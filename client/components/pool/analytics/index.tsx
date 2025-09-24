import { PoolInfo } from "@/types";

import { Charts } from "./charts";
import { Header } from "./header";

export const Analytics = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  return (
    <div className="space-y-4">
      <Header poolInfo={poolInfo} />
      <Charts poolInfo={poolInfo} />
    </div>
  );
};
