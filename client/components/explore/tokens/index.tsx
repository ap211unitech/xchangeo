import { Bitcoin } from "lucide-react";

export const Tokens = () => {
  return (
    <section className="space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
            <Bitcoin className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-foreground text-4xl font-bold">All Tokens</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          View all available tokens along with your current balances. Stay on top of your assets in one place.
        </p>
      </div>
    </section>
  );
};
