import { DropletOff } from "lucide-react";

import { RemoveLiquidityForm } from "./form";

export const RemoveLiquidity = () => {
  return (
    <section className="mx-auto max-w-[40rem] space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center">
          <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
            <DropletOff className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-foreground text-4xl font-bold">Remove liquidity</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">Easily remove your liquidity from the pool and reclaim your tokens.</p>
      </div>

      {/* Main Form */}
      <RemoveLiquidityForm />
    </section>
  );
};
