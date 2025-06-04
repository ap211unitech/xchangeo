import "./globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { AppProvider } from "@/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Xchangeo || Decentralized AMM-Based Exchange",
  description: "Xchangeo is a decentralized exchange powered by an automated market maker (AMM) protocol.",
  metadataBase: new URL("https://xchangeo.vercel.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
