import { Droplets } from "lucide-react";
import { notFound } from "next/navigation";

import { appService } from "@/services";
import { TSearchParams } from "@/types";

import { FaucetForm } from "./form";

export const Faucets = async ({ searchParams }: { searchParams: TSearchParams }) => {
  const tokens = await appService.tokenService.getAllTokens();
  const defaultToken = tokens.at(0)?.contractAddress;

  const selectedTokenAddress = ((await searchParams)?.token ?? defaultToken) as string;

  if (!selectedTokenAddress) return notFound();

  const faucetMetadata = await appService.faucetService.getMetadata(selectedTokenAddress);

  if (!faucetMetadata) return notFound();

  return (
    <section className="mx-auto max-w-[40rem] space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center">
          <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
            <Droplets className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-foreground text-4xl font-bold">Xchangeo Faucet</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Get free testnet tokens for testing. Select the token, enter your wallet address, and receive tokens instantly.
        </p>
      </div>

      {/* Main Form */}
      <FaucetForm availableTokens={tokens} faucetMetadata={faucetMetadata} />
    </section>
  );
};
