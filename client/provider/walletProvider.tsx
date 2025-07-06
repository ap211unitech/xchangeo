"use client";

import { AppKitNetwork, hardhat, sepolia } from "@reown/appkit/networks";
import { createAppKit, Metadata, ThemeMode, useAppKitTheme } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { useTheme } from "next-themes";
import { ReactNode, useEffect } from "react";

import { CONFIG } from "@/config";

/******************************* WalletConnect modal config *******************************/

if (!CONFIG.REOWN_PROJECT_ID) {
  throw new Error("Reown Project ID is not defined");
}

const SUPPORTED_NETWORKS: [AppKitNetwork, ...AppKitNetwork[]] = CONFIG.IN_PRODUCTION ? [sepolia] : [hardhat];

const metadata: Metadata = {
  name: "Xchangeo",
  description: "Decentralized AMM-Based Exchange",
  url: CONFIG.IN_PRODUCTION ? "https://xchangeo.vercel.app/" : "http://localhost:3000", // origin must match your domain & subdomain
  icons: [CONFIG.IN_PRODUCTION ? "https://xchangeo.vercel.app/favicon.ico" : "http://localhost:3000/favicon.ico"],
};

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: SUPPORTED_NETWORKS,
  projectId: CONFIG.REOWN_PROJECT_ID,
  features: {
    email: false,
    socials: false,
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    "--w3m-border-radius-master": "2px",
  },
});

/******************************* ************************* *******************************/

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  const { setThemeMode, setThemeVariables } = useAppKitTheme();

  useEffect(() => {
    setThemeMode(theme as ThemeMode);
    setThemeVariables({
      "--w3m-color-mix-strength": theme === "light" ? 5 : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return <>{children}</>;
};
