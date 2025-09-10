import { ArrowRightLeft } from "lucide-react";

import { ConnectWalletOverlay } from "@/components/ui";
import { appService } from "@/services";

import { SwapTokensForm } from "./form";

export const Swap = async () => {
  const [allLiquidityPools, tokens] = await Promise.all([await appService.poolService.getAllPools(), await appService.tokenService.getAllTokens()]);

  return (
    <section className="mx-auto max-w-[40rem] space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center">
          <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
            <ArrowRightLeft className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-foreground text-4xl font-bold">Swap tokens</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Swap between supported tokens seamlessly with real-time price updates. Choose your tokens, and execute your trade in seconds.
        </p>
      </div>

      {/* Swap Form */}
      <ConnectWalletOverlay className="h-72 md:mx-auto md:max-w-3/4">
        <SwapTokensForm tokens={tokens} allLiquidityPools={allLiquidityPools} />
      </ConnectWalletOverlay>
    </section>
  );
};
