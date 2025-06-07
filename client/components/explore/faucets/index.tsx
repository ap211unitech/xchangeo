import { Droplets } from "lucide-react";

import { FaucetForm } from "./form";

export const Faucets = () => {
  return (
    <section className="mx-auto max-w-[40rem] space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center">
          <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
            <Droplets className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-foreground text-4xl font-bold">Xchangeo Faucet</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Get free testnet tokens for testing. Select the token, enter your wallet address, and receive tokens instantly.
        </p>
      </div>

      {/* Main Form */}
      <FaucetForm />
    </section>
  );
};
