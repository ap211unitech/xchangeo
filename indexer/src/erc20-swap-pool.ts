import { BigInt } from "@graphprotocol/graph-ts";
import { Pool__Created as Pool__CreatedEvent } from "../generated/ERC20SwapPool/ERC20SwapPool";
import { Pool, ERC20Token } from "../generated/schema";

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
