import { PoolInfo } from "@/types";

import { Header } from "./header";

export const Analytics = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  return (
    <>
      <Header poolInfo={poolInfo} />
      <div className="my-4 h-96 border">Analytics</div>
    </>
  );
};
