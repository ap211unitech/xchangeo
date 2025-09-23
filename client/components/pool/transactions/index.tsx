import { Transactions } from "./transactions";

export const PoolTransactions = ({ poolAddress }: { poolAddress: string }) => {
  return (
    <section className="space-y-8">
      <h1 className="text-foreground text-4xl font-medium">Transactions</h1>

      {/* Pool Activity */}
      <Transactions poolAddress={poolAddress} />
    </section>
  );
};
