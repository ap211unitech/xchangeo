import { History } from "lucide-react";

import { RefreshRoute } from "@/components/ui";
import { revalidateFaucetHistory } from "@/constants";
import { appService } from "@/services";

import { Transactions } from "./transactions";

export const FaucetHistory = async () => {
  const faucetTransactionsHistory = await appService.faucetService.getFaucetTransactionsHistory();

  return (
    <section className="space-y-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-0">
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
        <RefreshRoute onRefresh={revalidateFaucetHistory} />
      </div>

      {/* Faucet Transactions History */}
      <Transactions faucetTransactionsHistory={faucetTransactionsHistory} />
    </section>
  );
};
