import { ReactElement, SVGProps } from "react";

import { cn } from "@/lib/utils";

import { BTC } from "./btc";
import { DAI } from "./dai";
import { ETH } from "./eth";
import { UNKNOWN } from "./unkn";
import { USDC } from "./usdc";
import { USDT } from "./usdt";

const ICONS: Record<string, (_props: SVGProps<SVGSVGElement>) => ReactElement> = {
  ETH,
  WETH: ETH,
  HETH: ETH,
  DAI,
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
  const Icon = ICONS[ticker] ?? ICONS.UNKNOWN;

  return <Icon id={id} className={cn("size-8", className)} />;
};
