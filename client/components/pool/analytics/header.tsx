import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge, Button } from "@/components/ui";
import Etherscan from "@/public/etherscan.svg";
import { PoolInfo } from "@/types";

export const Header = ({ poolInfo }: { poolInfo: PoolInfo }) => {
  return (
    <div className="flex items-center justify-between space-y-4">
      <div className="flex items-center">
        <div className="to-primary mr-3 rounded-full bg-gradient-to-tl from-violet-600 p-3">
          <EyeIcon className="text-primary-foreground h-8 w-8" />
        </div>
        <h1 className="text-foreground text-4xl font-bold">
          {poolInfo.tokenA.ticker}/{poolInfo.tokenB.ticker}
        </h1>
        <Badge variant="secondary" size="lg" className="ml-2 rounded-sm px-2">
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
