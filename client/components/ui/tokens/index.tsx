import { ReactElement, SVGProps } from "react";

import { cn } from "@/lib/utils";

import { BTC } from "./btc";
import { DAI } from "./dai";
import { ETH } from "./eth";
import { LINK } from "./link";
import { LP } from "./lp";
import { UNKNOWN } from "./unkn";
import { USDC } from "./usdc";
import { USDT } from "./usdt";
import { WETH } from "./weth";

const ICONS: Record<string, (_props: SVGProps<SVGSVGElement>) => ReactElement> = {
  ETH,
  WETH,
  HETH: ETH,
  DAI,
  LP,
  LINK,
  USDT,
  USDC,
  UNKNOWN,
  WBTC: BTC,
};

type Props = {
  id?: string;
  className?: string;
  ticker: string;
};

export const TokenLogo = ({ className, id, ticker }: Props) => {
  const Icon = ICONS[ticker.includes("LP") ? "LP" : ticker] ?? ICONS.UNKNOWN;

  return <Icon id={id} className={cn("size-8", className)} />;
};
