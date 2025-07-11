"use client";

import { useAppKit, useAppKitAccount, useWalletInfo } from "@reown/appkit/react";
import { Circle, CircleHelp, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button, ImageComponent } from "@/components/ui";
import { trimString } from "@/lib/utils";

export const ConnectWallet = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { address, status } = useAppKitAccount();
  const { walletInfo } = useWalletInfo();
  const { open } = useAppKit();

  const connecting = useMemo(() => {
    return !isMounted || status === "connecting";
  }, [isMounted, status]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!!address && !!walletInfo) {
    return (
      <>
        <Button onClick={() => open()} className="dark:bg-primary/60 flex items-center gap-2">
          <div>
            {walletInfo?.icon && walletInfo.name ? (
              <ImageComponent src={walletInfo?.icon} alt={walletInfo?.name} width={18} height={18} />
            ) : (
              <CircleHelp className="stroke-primary h-5 w-5" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <p>{trimString(address)}</p>
            <Circle className="size-3.5 fill-green-400 stroke-0" />
          </div>
        </Button>
      </>
    );
  }

  return (
    <Button onClick={() => open()} disabled={connecting}>
      {connecting ? (
        <section className="flex items-center gap-1">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Connecting...</p>
        </section>
      ) : (
        <section>Connect Wallet</section>
      )}
    </Button>
  );
};
