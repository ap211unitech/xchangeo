"use client";

import { ReactNode } from "react";

import { ThemeProvider } from "./themeProvider";
import { WalletProvider } from "./walletProvider";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <WalletProvider>{children}</WalletProvider>
    </ThemeProvider>
  );
};
