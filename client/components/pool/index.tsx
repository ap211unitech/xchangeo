import { notFound } from "next/navigation";

import { appService } from "@/services";

import { Analytics } from "./analytics";
import { Metadata } from "./metadata";
import { PoolTransactions } from "./transactions";

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
    <section className="grid grid-cols-8 gap-6 xl:grid-cols-6">
      <div className="col-span-full lg:col-span-5 xl:col-span-4">
        <Analytics poolInfo={poolInfo} />
        <hr className="my-10 border-1" />
        <PoolTransactions poolAddress={poolAddress} />
      </div>
      <Metadata poolInfo={poolInfo} />
    </section>
  );
};
