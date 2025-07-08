"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { PropsWithChildren } from "react";

import { Card, CardDescription } from "./card";
import { ConnectWallet } from "./connectWallet";

export const ConnectWalletOverlay = ({ children }: PropsWithChildren) => {
  const { address } = useAppKitAccount();

  return !!address ? (
    children
  ) : (
    <Card className="grid h-52 place-items-center overflow-hidden text-center">
      <CardDescription className="space-y-4">
        <ConnectWallet />
        <p className="text-base">Please connect your wallet to continue.</p>
      </CardDescription>
    </Card>
  );
};
