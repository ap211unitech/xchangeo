import { History } from "lucide-react";

import { Transactions } from "./transactions";

export const FaucetHistory = () => {
  return (
    <section className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
            <History className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-foreground text-4xl font-bold">Faucet History</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          View past faucet requests, including timestamps and token details. Easily track all test token claims in one place.
        </p>
      </div>

      {/* Faucet Transactions History */}
      <Transactions />
    </section>
  );
};
