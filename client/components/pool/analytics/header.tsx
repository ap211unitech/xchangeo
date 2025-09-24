import Image from "next/image";
import Link from "next/link";

import { Badge, Button, TokenLogo } from "@/components/ui";
import Etherscan from "@/public/etherscan.svg";
import { PoolInfo } from "@/types";

export const Header = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="-mr-6 flex items-center">
          <TokenLogo className="size-14" ticker={poolInfo.tokenA.ticker} />
          <TokenLogo className="relative -left-6 size-14" ticker={poolInfo.tokenB.ticker} />
        </div>
        <h1 className="text-foreground text-4xl font-bold">
          {poolInfo.tokenA.ticker}/{poolInfo.tokenB.ticker}
        </h1>
        <Badge variant="secondary" size="lg" className="rounded-sm px-2">
          {poolInfo.feeTier / 100}%
        </Badge>
      </div>
      <Button asChild className="rounded-full" size="icon" variant="ghost">
        <Link href={`https://sepolia.etherscan.io/address/${poolInfo.poolAddress}`} target="_blank">
          <Image className="dark:brightness-200" alt="Etherscan" src={Etherscan} width={25} height={25} />
        </Link>
      </Button>
    </div>
  );
};
