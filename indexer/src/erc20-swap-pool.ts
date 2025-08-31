import { BigInt } from "@graphprotocol/graph-ts";
import {
  Pool__Created as Pool__CreatedEvent,
  LiquidityAdded as LiquidityAddedEvent,
  LiquidityRemoved as LiquidityRemovedEvent,
  TokenSwapped as TokenSwappedEvent,
} from "../generated/ERC20SwapPool/ERC20SwapPool";
import { Pool, ERC20Token, PoolTransaction } from "../generated/schema";

export function handlePoolCreated(event: Pool__CreatedEvent): void {
  const id = event.address.toHex();

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
  entity.pool = event.address;
  entity.tokenA = event.params.token1.toHex();
  entity.tokenB = event.params.token2.toHex();
  entity.lpToken = event.params.lpToken.toHex();
  entity.fee = event.params.fee;
  entity.reserveA = new BigInt(0);
  entity.reserveB = new BigInt(0);
  entity.fee = event.params.fee;
  entity.timestamp = event.block.timestamp;

  entity.save();
}

export function handleLiquidityAdded(event: LiquidityAddedEvent): void {
  const poolEntity = new Pool(event.params.pool.toHex());
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
    poolTransactionEntity.eventType = "AddLiquidity";

    poolTransactionEntity.save();
  }
}

export function handleLiquidityRemoved(event: LiquidityRemovedEvent): void {
  const poolEntity = new Pool(event.params.pool.toHex());

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

    poolTransactionEntity.save();
  }
}

export function handleTokenSwapped(event: TokenSwappedEvent): void {
  const poolEntity = new Pool(event.params.pool.toHex());

  if (poolEntity) {
    poolEntity.reserveA = event.params.reserveToken1;
    poolEntity.reserveB = event.params.reserveToken2;

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

    poolTransactionEntity.save();
  }
}
