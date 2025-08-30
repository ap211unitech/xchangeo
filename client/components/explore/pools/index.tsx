import { GlassWater, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";
import { appService } from "@/services";

import { PoolsList } from "./pools";

export const Pools = async () => {
  const allLiquidityPools = await appService.poolService.getAllPools();

  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
              <GlassWater className="text-primary-foreground h-8 w-8" />
            </div>
            <h1 className="text-foreground text-4xl font-bold">Liquidity Pools</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Explore available liquidity pools. View pool details, token pairs, and your current positions in one place.
          </p>
        </div>
        <Button asChild>
          <Link href="/pools/addLiquidity">
            <Plus /> Add Liquidity
          </Link>
        </Button>
      </div>

      {/* Pools list */}
      <PoolsList allLiquidityPools={allLiquidityPools} />
    </section>
  );
};
