import { PoolInfo } from "@/types";

import { Actions } from "./actions";
import { Links } from "./links";
import { Stats } from "./stats";

export const Metadata = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  return (
    <div className="col-span-full space-y-4 lg:col-span-3 xl:col-span-2">
      <Actions poolInfo={poolInfo} />
      <Stats poolInfo={poolInfo} />
      <Links poolInfo={poolInfo} />
    </div>
  );
};
