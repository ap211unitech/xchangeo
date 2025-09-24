import { ArrowLeftRight, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";
import { PoolInfo } from "@/types";

export const Actions = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button asChild className="bg-primary/10 hover:bg-primary/10 text-primary rounded-xl font-semibold" size="xl">
        <Link
          href={{
            pathname: "/swap",
            query: { sellToken: poolInfo.tokenA.contractAddress, buyToken: poolInfo.tokenB.contractAddress },
          }}
        >
          <ArrowLeftRight className="size-4" /> Swap
        </Link>
      </Button>
      <Button className="bg-primary/10 hover:bg-primary/10 text-primary rounded-xl font-semibold" size="xl" asChild>
        <Link
          href={{
            pathname: "/pools/addLiquidity",
            query: { pool: poolInfo.poolAddress },
          }}
        >
          <Plus className="size-4" /> Add Liquidity
        </Link>
      </Button>
    </div>
  );
};
