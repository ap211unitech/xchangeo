import { ReactElement, SVGProps } from "react";

import { BTC } from "./btc";
import { DAI } from "./dai";
import { ETH } from "./eth";
import { UNKNOWN } from "./unkn";
import { USDC } from "./usdc";
import { USDT } from "./usdt";

// eslint-disable-next-line no-unused-vars
const ICONS: Record<string, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  ETH,
  WETH: ETH,
  HETH: ETH,
  DAI,
  USDT,
  USDC,
  UNKNOWN,
  WBTC: BTC,
};

export const TokenLogo = ({ ticker }: { ticker: string }) => {
  const Icon = ICONS[ticker] ?? ICONS.UNKNOWN;

  return <Icon className="size-8" />;
};
