"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

import { Card, CardDescription } from "./card";
import { ConnectWallet } from "./connectWallet";

type Props = { className?: string };

export const ConnectWalletOverlay = ({ children, className }: PropsWithChildren<Props>) => {
  const { address } = useAppKitAccount();

  return !!address ? (
    children
  ) : (
    <Card className={cn("grid h-52 place-items-center overflow-hidden text-center", className)}>
      <CardDescription className="space-y-4">
        <ConnectWallet />
        <p className="text-base">Please connect your wallet to continue.</p>
      </CardDescription>
    </Card>
  );
};
