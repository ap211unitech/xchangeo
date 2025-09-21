import Image from "next/image";
import Link from "next/link";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, TokenLogo } from "@/components/ui";
import { NATIVE_TOKEN } from "@/constants";
import { trimString } from "@/lib/utils";
import Etherscan from "@/public/etherscan.svg";
import { PoolInfo } from "@/types";

export const Links = ({ poolInfo: { poolAddress, tokenA, tokenB } }: { poolInfo: PoolInfo }) => {
  return (
    <Card className="border-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl font-medium tracking-wide md:text-2xl">Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pool Link */}
        <div className="flex items-center justify-between">
          <div className="flex w-fit items-center">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <TokenLogo ticker={tokenA.ticker} />
            </div>

            <div className="relative -left-2 h-8 w-8 overflow-hidden rounded-full">
              <TokenLogo ticker={tokenB.ticker} />
            </div>
            <p className="flex items-center gap-1 text-base tracking-wide">
              {tokenA.ticker} / {tokenB.ticker}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge copy={poolAddress} className="rounded-full" variant="secondary" size="lg">
              {trimString(poolAddress)}
            </Badge>
            <Button asChild className="rounded-full" size="icon" variant="secondary">
              <Link href={`https://sepolia.etherscan.io/address/${poolAddress}`} target="_blank">
                <Image className="dark:brightness-200" alt="Etherscan" src={Etherscan} width={20} height={20} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Token A Link */}
        <div className="flex items-center justify-between">
          <div className="flex w-fit items-center gap-2">
            <TokenLogo ticker={tokenA.ticker} />
            <p className="flex items-center gap-1 text-base tracking-wide">{tokenA.ticker}</p>
          </div>
          <div className="flex items-center gap-2">
            {tokenA.contractAddress !== NATIVE_TOKEN.contractAddress && (
              <Badge copy={tokenA.contractAddress} className="rounded-full" variant="secondary" size="lg">
                {trimString(tokenA.contractAddress)}
              </Badge>
            )}
            <Button asChild className="rounded-full" size="icon" variant="secondary">
              <Link href={`https://sepolia.etherscan.io/address/${tokenA.contractAddress}`} target="_blank">
                <Image className="dark:brightness-200" alt="Etherscan" src={Etherscan} width={20} height={20} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Token B Link */}
        <div className="flex items-center justify-between">
          <div className="flex w-fit items-center gap-2">
            <TokenLogo ticker={tokenB.ticker} />
            <p className="flex items-center gap-1 text-base tracking-wide">{tokenB.ticker}</p>
          </div>
          <div className="flex items-center gap-2">
            {tokenB.contractAddress !== NATIVE_TOKEN.contractAddress && (
              <Badge copy={tokenB.contractAddress} className="rounded-full" variant="secondary" size="lg">
                {trimString(tokenB.contractAddress)}
              </Badge>
            )}
            <Button asChild className="rounded-full" size="icon" variant="secondary">
              <Link href={`https://sepolia.etherscan.io/address/${tokenB.contractAddress}`} target="_blank">
                <Image className="dark:brightness-200" alt="Etherscan" src={Etherscan} width={20} height={20} />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
