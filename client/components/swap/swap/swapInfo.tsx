import { FuelIcon } from "lucide-react";
import { PropsWithChildren } from "react";

import { Button, HoverCard, HoverCardContent, HoverCardTrigger, TokenLogo } from "@/components/ui";
import { cn, getHumanizeValue } from "@/lib/utils";
import { GetAmountOutOnSwap, TokenMetadata } from "@/types";

type Props = {
  estimatedFeeInfo?: GetAmountOutOnSwap;
  sellAmountFormValue: number;
  selectedSellToken?: TokenMetadata;
  selectedBuyToken?: TokenMetadata;
  isFetchingEstimatedFeeInfo: boolean;
};

export const SwapInfo = ({ estimatedFeeInfo, isFetchingEstimatedFeeInfo, sellAmountFormValue, selectedSellToken, selectedBuyToken }: Props) => {
  return (
    sellAmountFormValue > 0 && (
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild className={cn("group", isFetchingEstimatedFeeInfo && "animate-pulse")}>
          <Button variant="ghost">
            <FuelIcon className="size-4" />
            Swap Info
          </Button>
        </HoverCardTrigger>
        <HoverCardContent side="top" className="w-72 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">You&apos;ll selling:</p>
            <SkeletonLoading isLoading={!estimatedFeeInfo}>
              <div className="flex items-center gap-2">
                <span>
                  {getHumanizeValue(sellAmountFormValue)} {selectedSellToken?.ticker}
                </span>
                <TokenLogo className="size-6" ticker={selectedSellToken?.ticker || ""} />
              </div>
            </SkeletonLoading>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Trading Fee</p>
            <SkeletonLoading isLoading={!estimatedFeeInfo}>
              <div className="flex items-center gap-2">
                <span>
                  {getHumanizeValue(estimatedFeeInfo?.fee.amount)} {estimatedFeeInfo?.fee.token.ticker}
                </span>
                <TokenLogo className="size-6" ticker={estimatedFeeInfo?.fee.token.ticker || ""} />
              </div>
            </SkeletonLoading>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">You&apos;ll receive:</p>
            <SkeletonLoading isLoading={!estimatedFeeInfo}>
              <div className="flex items-center gap-2">
                <span>
                  {getHumanizeValue(estimatedFeeInfo?.amountOut)} {selectedBuyToken?.ticker}
                </span>
                <TokenLogo className="size-6" ticker={selectedBuyToken?.ticker || ""} />
              </div>
            </SkeletonLoading>
          </div>

          <div className="text-muted-foreground mt-4 text-xs">
            This is the cost to process your transaction on the blockchain. Xchangeo does not receive any share of these fees.
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  );
};

const SkeletonLoading = ({ isLoading, children }: PropsWithChildren<{ isLoading?: boolean }>) => {
  return isLoading ? <div className="bg-secondary h-2 w-20 animate-pulse rounded-sm" /> : children;
};
