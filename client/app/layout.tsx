import "./globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { Footer, Header } from "@/components/ui";
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
        <AppProvider>
          <Header />
          <main className="mx-auto min-h-[60vh] max-w-[88rem] px-4 pt-8 pb-12 sm:px-6 lg:px-8">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
