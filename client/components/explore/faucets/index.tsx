import { Droplets } from "lucide-react";

export const Faucets = () => {
  return (
    <>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="from-primary to-chart-1 mr-3 rounded-full bg-gradient-to-bl p-3">
            <Droplets className="h-8 w-8" />
          </div>
          <h1 className="text-primary-foreground text-4xl font-bold">Xchangeo Faucet</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Get free testnet tokens for testing. Select the token, enter your wallet address, and receive tokens instantly.
        </p>
      </div>

      {/* Main Form */}
    </>
  );
};
