import { EyeIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { appService } from "@/services";

import { Metadata } from "./metadata";

type Props = {
  poolAddress: string;
};

const getPoolInfo = async (poolAddress: string) => {
  try {
    return await appService.poolService.getPoolInfo(poolAddress);
  } catch {
    return null;
  }
};

export const PoolInfo = async ({ poolAddress }: Props) => {
  if (!poolAddress) return notFound();

  const poolInfo = await getPoolInfo(poolAddress);

  if (!poolInfo) return notFound();

  return (
    <section className="grid grid-cols-6 gap-10">
      <div className="col-span-full border md:col-span-3 xl:col-span-4">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
              <EyeIcon className="text-primary-foreground h-8 w-8" />
            </div>
            <h1 className="text-foreground text-4xl font-bold">
              {poolInfo.tokenA.ticker}/{poolInfo.tokenB.ticker}
            </h1>
          </div>
        </div>
      </div>
      <Metadata poolInfo={poolInfo} />
    </section>
  );
};
