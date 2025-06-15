import { History } from "lucide-react";

export const SwapHistory = () => {
  return (
    <section className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
            <History className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-foreground text-4xl font-bold">Swap History</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Easily track all token swaps with timestamps and token details, consolidated in a single, convenient view.
        </p>
      </div>

      {/* Swap History */}
      {/* <Transactions /> */}
    </section>
  );
};
