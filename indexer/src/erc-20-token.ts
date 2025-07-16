import {
  ERC20TokenCreated as ERC20TokenCreatedEvent,
  Transfer as TransferEvent,
} from "../generated/ERC20Token/ERC20Token";
import { Transfer, ERC20Token } from "../generated/schema";

export function handleERC20TokenCreated(event: ERC20TokenCreatedEvent): void {
  const id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  const entity = new ERC20Token(id);
  entity.tokenAddress = event.params.token;
  entity.name = event.params.name;
  entity.symbol = event.params.symbol;
  entity.timestamp = event.block.timestamp;
  entity.blockNumber = event.block.number;

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.token = event.address; // ERC20 Token Address
  entity.amount = event.params.value;

  entity.timestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.eventType = "ERC20";

  entity.save();
}
