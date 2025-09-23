import { PoolInfo } from "@/types";

import { Charts } from "./charts";
import { Header } from "./header";

export const Analytics = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  return (
    <div className="space-y-8">
      <Header poolInfo={poolInfo} />
      <div className="pb-20">
        <Charts poolInfo={poolInfo} />
      </div>
    </div>
  );
};
