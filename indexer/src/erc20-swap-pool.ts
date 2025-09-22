import { BigInt } from "@graphprotocol/graph-ts";
import {
  PoolCreated as PoolCreatedEvent,
  LiquidityAdded as LiquidityAddedEvent,
  LiquidityRemoved as LiquidityRemovedEvent,
  TokenSwapped as TokenSwappedEvent,
} from "../generated/ERC20SwapPool/ERC20SwapPool";
import { Pool, ERC20Token, PoolTransaction } from "../generated/schema";

export function handlePoolCreated(event: PoolCreatedEvent): void {
  const id = event.params.pool.toHex();

  let lpToken = ERC20Token.load(event.params.lpToken.toHex());

  if (!lpToken) {
    lpToken = new ERC20Token(event.params.lpToken.toHex());
    lpToken.tokenAddress = event.params.lpToken;
    lpToken.name = event.params.lpTokenName;
    lpToken.symbol = event.params.lpTokenSymbol;
    lpToken.timestamp = event.block.timestamp;
    lpToken.transactionHash = event.transaction.hash;

    lpToken.save();
  }

  const entity = new Pool(id);
  entity.pool = event.params.pool;
  entity.tokenA = event.params.token1.toHex();
  entity.tokenB = event.params.token2.toHex();
  entity.lpToken = event.params.lpToken.toHex();
  entity.fee = event.params.fee;
  entity.reserveA = new BigInt(0);
  entity.reserveB = new BigInt(0);
  entity.allTimeVolumeA = new BigInt(0);
  entity.allTimeVolumeB = new BigInt(0);
  entity.allTimeFeesA = new BigInt(0);
  entity.allTimeFeesB = new BigInt(0);
  entity.fee = event.params.fee;
  entity.timestamp = event.block.timestamp;

  entity.save();
}

export function handleLiquidityAdded(event: LiquidityAddedEvent): void {
  const poolEntity = Pool.load(event.params.pool.toHex());

  if (poolEntity) {
    poolEntity.reserveA = event.params.reserveToken1;
    poolEntity.reserveB = event.params.reserveToken2;

    poolEntity.save();

    const id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    const poolTransactionEntity = new PoolTransaction(id);

    poolTransactionEntity.pool = event.params.pool.toHex();
    poolTransactionEntity.tokenA = event.params.token1.toHex();
    poolTransactionEntity.tokenB = event.params.token2.toHex();
    poolTransactionEntity.sender = event.params.sender;
    poolTransactionEntity.amountA = event.params.tokenAmount1;
    poolTransactionEntity.amountB = event.params.tokenAmount2;
    poolTransactionEntity.timestamp = event.block.timestamp;
    poolTransactionEntity.eventType = "AddLiquidity";
    poolTransactionEntity.reserveA = event.params.reserveToken1;
    poolTransactionEntity.reserveB = event.params.reserveToken2;
    poolTransactionEntity.feesA = BigInt.fromI32(0);
    poolTransactionEntity.feesB = BigInt.fromI32(0);
    poolTransactionEntity.lpTokenAmount = event.params.mintedLpTokens;
    poolTransactionEntity.transactionHash = event.transaction.hash;

    poolTransactionEntity.save();
  }
}

export function handleLiquidityRemoved(event: LiquidityRemovedEvent): void {
  const poolEntity = Pool.load(event.params.pool.toHex());

  if (poolEntity) {
    poolEntity.reserveA = event.params.reserveToken1;
    poolEntity.reserveB = event.params.reserveToken2;

    poolEntity.save();

    const id = event.transaction.hash.toHex();
    const poolTransactionEntity = new PoolTransaction(id);

    poolTransactionEntity.pool = event.params.pool.toHex();
    poolTransactionEntity.tokenA = event.params.token1.toHex();
    poolTransactionEntity.tokenB = event.params.token2.toHex();
    poolTransactionEntity.sender = event.params.sender;
    poolTransactionEntity.amountA = event.params.tokenAmount1;
    poolTransactionEntity.amountB = event.params.tokenAmount2;
    poolTransactionEntity.timestamp = event.block.timestamp;
    poolTransactionEntity.eventType = "RemoveLiquidity";
    poolTransactionEntity.reserveA = event.params.reserveToken1;
    poolTransactionEntity.reserveB = event.params.reserveToken2;
    poolTransactionEntity.feesA = BigInt.fromI32(0);
    poolTransactionEntity.feesB = BigInt.fromI32(0);
    poolTransactionEntity.lpTokenAmount =
      event.params.liquidityPoolTokens.times(BigInt.fromI32(-1)); // minus sign coz those assets were burnt

    poolTransactionEntity.transactionHash = event.transaction.hash;

    poolTransactionEntity.save();
  }
}

export function handleTokenSwapped(event: TokenSwappedEvent): void {
  const poolEntity = Pool.load(event.params.pool.toHex());

  let feesA = BigInt.fromI32(0);
  let feesB = BigInt.fromI32(0);

  if (poolEntity) {
    poolEntity.reserveA = event.params.reserveToken1;
    poolEntity.reserveB = event.params.reserveToken2;

    // Update all-time volumes for tokens
    if (event.params.tokenIn.toHex() == poolEntity.tokenA) {
      poolEntity.allTimeVolumeA = poolEntity.allTimeVolumeA.plus(
        event.params.amountIn
      );
      poolEntity.allTimeVolumeB = poolEntity.allTimeVolumeB.plus(
        event.params.amountOut
      );

      // fees in tokenA
      feesA = event.params.amountIn
        .times(poolEntity.fee)
        .div(BigInt.fromI32(10000)); // fee in basis points i.e. 0.3% denoted as 30; so, 0.3% = 30/100_00
      poolEntity.allTimeFeesA = poolEntity.allTimeFeesA.plus(feesA);
    } else {
      poolEntity.allTimeVolumeA = poolEntity.allTimeVolumeA.plus(
        event.params.amountOut
      );
      poolEntity.allTimeVolumeB = poolEntity.allTimeVolumeB.plus(
        event.params.amountIn
      );

      // fees in tokenB
      feesB = event.params.amountIn
        .times(poolEntity.fee)
        .div(BigInt.fromI32(10000));
      poolEntity.allTimeFeesB = poolEntity.allTimeFeesB.plus(feesB);
    }

    poolEntity.save();

    const id = event.transaction.hash.toHex();
    const poolTransactionEntity = new PoolTransaction(id);

    poolTransactionEntity.pool = event.params.pool.toHex();
    poolTransactionEntity.tokenA = event.params.tokenIn.toHex();
    poolTransactionEntity.tokenB = event.params.tokenOut.toHex();
    poolTransactionEntity.sender = event.params.sender;
    poolTransactionEntity.amountA = event.params.amountIn;
    poolTransactionEntity.amountB = event.params.amountOut;
    poolTransactionEntity.timestamp = event.block.timestamp;
    poolTransactionEntity.eventType = "Swap";
    poolTransactionEntity.reserveA = event.params.reserveToken1;
    poolTransactionEntity.reserveB = event.params.reserveToken2;
    poolTransactionEntity.feesA = feesA;
    poolTransactionEntity.feesB = feesB;
    poolTransactionEntity.lpTokenAmount = BigInt.fromI32(0);

    poolTransactionEntity.transactionHash = event.transaction.hash;

    poolTransactionEntity.save();
  }
}
