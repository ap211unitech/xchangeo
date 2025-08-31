import { Droplet } from "lucide-react";

import { appService } from "@/services";

import { AddLiquidityForm } from "./form";

export const AddLiquidity = async () => {
  const allLiquidityPools = await appService.poolService.getAllPools();

  return (
    <section className="mx-auto max-w-[40rem] space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center">
          <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
            <Droplet className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-foreground text-4xl font-bold">Add liquidity</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">Deposit tokens into the pool and start earning from swaps.</p>
      </div>

      {/* Main Form */}
      <AddLiquidityForm allLiquidityPools={allLiquidityPools} />
    </section>
  );
};
