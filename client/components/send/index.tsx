import { SendIcon } from "lucide-react";

import { SendTokensForm } from "./form";

export const Send = () => {
  return (
    <section className="mx-auto max-w-[40rem] space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center">
          <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
            <SendIcon className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-foreground text-4xl font-bold">Send tokens</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">Transfer supported tokens quickly and securely.</p>
      </div>

      {/* Main Form */}
      <SendTokensForm />
    </section>
  );
};
