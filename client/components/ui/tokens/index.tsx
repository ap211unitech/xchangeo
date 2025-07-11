import { ReactElement, SVGProps } from "react";

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

export const TokenLogo = ({ id, ticker }: { id?: string; ticker: string }) => {
  const Icon = ICONS[ticker] ?? ICONS.UNKNOWN;

  return <Icon id={id} className="size-8" />;
};
